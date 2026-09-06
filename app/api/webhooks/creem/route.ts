import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { gateway, isCardCheckoutEnabled, type GatewayEvent } from "@/lib/payments";
import { sendPaymentSuccessEmail, sendOwnerPaymentEmail } from "@/lib/payments/notify";
import { pricingPlans } from "@/lib/content";
import { allCoursesMeta } from "@/lib/content/courses";
import type { PlanId } from "@/lib/content";

/**
 * Creem webhook — the only place card payments grant access.
 *
 * This is an inbound callback from an external system, so it has to be a route
 * handler: there is no session and no form behind it, which is what Server
 * Actions assume. Everything the user themselves triggers still goes through
 * `lib/actions/checkout.ts`.
 *
 * Guarantees, in order:
 *   1. HMAC-SHA256 over the RAW body — a bad signature never reaches the DB.
 *   2. The paid product must match the plan stored on our row, so a cheap
 *      checkout cannot approve an expensive plan.
 *   3. Idempotent — Creem retries up to 5 times over 24h and replays are
 *      available from their dashboard, so an event id is applied at most once.
 *
 * The Creem products are monthly subscriptions, so `subscription.paid` is the
 * event that actually pays for a period — including the first one. Access is
 * granted strictly up to the billed `current_period_end_date`, which means a
 * cancelled or lapsed subscription needs no handler: it simply expires.
 */

// node:crypto in the signature check — never the edge runtime.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isCardCheckoutEnabled || !isServiceRoleConfigured) {
    console.warn("[creem] webhook hit while checkout is not configured");
    return new Response("Not configured", { status: 503 });
  }

  // Must be the exact bytes that were signed — parsing and re-serialising
  // reorders keys and the digest stops matching.
  const rawBody = await request.text();
  const signature = request.headers.get("creem-signature");

  const result = gateway.parseWebhook(rawBody, signature);

  if (result.status === "invalid") {
    console.warn("[creem] signature rejected");
    return new Response("Invalid signature", { status: 401 });
  }
  if (result.status === "ignored") {
    // 200 so Creem stops retrying an event we will never act on.
    return Response.json({ received: true, ignored: result.eventType });
  }

  try {
    switch (result.event.type) {
      case "payment.completed":
        return await handleCompleted(result.event);
      case "subscription.renewed":
        return await handleRenewed(result.event);
      case "payment.refunded":
        return await handleRefunded(result.event);
    }
  } catch (err) {
    // 500 asks Creem to retry — correct for a transient DB failure.
    console.error("[creem] handler failed:", err);
    return new Response("Handler error", { status: 500 });
  }
}

// -----------------------------------------------------------------------------

async function handleCompleted(event: GatewayEvent): Promise<Response> {
  const supabase = createAdminClient();

  const query = supabase
    .from("payment_requests")
    .select(
      "id, user_id, plan, selected_course_slug, amount_mdl, status, provider",
    );

  // `request_id` is our row id and is always present on checkout.completed;
  // the session id is a fallback for rows whose id column never got stored.
  const { data: row, error: rowErr } = event.requestId
    ? await query.eq("id", event.requestId).maybeSingle()
    : event.sessionId
      ? await query.eq("provider_session_id", event.sessionId).maybeSingle()
      : { data: null, error: null };

  if (rowErr) throw rowErr;

  if (!row) {
    // Nothing to match — a test event, or a row deleted after a failed start.
    // 200, because retrying will never find it either.
    console.warn("[creem] no payment_requests row for event", event.id);
    return Response.json({ received: true, matched: false });
  }

  if (row.status === "approved") {
    return Response.json({ received: true, idempotent: true });
  }

  // A checkout for the cheap product must not approve a row that claims an
  // expensive plan. The product id is authoritative — it comes from Creem.
  const expectedProduct = gateway.productIdForPlan(row.plan as PlanId);
  if (event.productId && expectedProduct && event.productId !== expectedProduct) {
    console.error(
      `[creem] product mismatch on row ${row.id}: paid ${event.productId}, ` +
        `plan "${row.plan}" expects ${expectedProduct}`,
    );
    return new Response("Product mismatch", { status: 400 });
  }

  // Recurring product → grant exactly the cadence Creem will bill. One-time
  // product → fall back to the plan's fixed 30/180 days.
  const { error: grantErr } = event.periodEnd
    ? await supabase.rpc("grant_subscription_until", {
        p_user_id: row.user_id,
        p_plan: row.plan,
        p_course_slug: row.selected_course_slug,
        p_expires_at: event.periodEnd,
      })
    : await supabase.rpc("grant_subscription_internal", {
        p_user_id: row.user_id,
        p_plan: row.plan,
        p_course_slug: row.selected_course_slug,
      });
  if (grantErr) throw grantErr;

  // Access exists now. From here on, failures must not produce a non-2xx —
  // a retry would re-grant and re-send the email.
  const { error: updateErr } = await supabase
    .from("payment_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_notes: `Plată card confirmată automat (${event.id})`,
      provider_order_id: event.orderId,
      provider_event_id: event.id,
      provider_session_id: event.sessionId,
      provider_subscription_id: event.subscriptionId,
      provider_customer_id: event.customerId,
      amount_cents: event.amountCents,
      currency: event.currency,
    })
    .eq("id", row.id);

  if (updateErr) {
    // Access is live but the row still reads pending — surface it loudly so
    // it gets reconciled by hand rather than silently double-granted later.
    console.error("[creem] granted but row not marked approved:", updateErr);
  }

  await notifyUser(supabase, row.user_id, row.plan as PlanId, row.amount_mdl, {
    courseSlug: row.selected_course_slug,
    amountCharged: formatCharged(event.amountCents, event.currency),
  });

  revalidatePath("/dashboard");
  revalidatePath("/abonament");
  revalidatePath("/admin/plati");

  return Response.json({ received: true, granted: true });
}

/**
 * A billing period was paid. Fires for the first payment too, moments after
 * `checkout.completed` — that first one is a harmless no-op re-grant to the
 * same period, because `grant_subscription_until` only ever moves the expiry
 * forward.
 *
 * Each renewal is recorded as its own approved row, so /admin/plati shows one
 * line per charge instead of a single row that silently changes meaning. The
 * unique index on `provider_event_id` is what makes the insert idempotent.
 */
async function handleRenewed(event: GatewayEvent): Promise<Response> {
  if (!event.subscriptionId || !event.periodEnd) {
    console.warn("[creem] renewal without subscription id or period end");
    return Response.json({ received: true, matched: false });
  }

  const supabase = createAdminClient();

  // The original checkout row carries the plan and course. Renewals inherit
  // them — the metadata on the event is only a fallback for the user id.
  const { data: origin, error: originErr } = await supabase
    .from("payment_requests")
    .select("id, user_id, plan, selected_course_slug, amount_mdl, period_end")
    .eq("provider_subscription_id", event.subscriptionId)
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (originErr) throw originErr;

  if (!origin) {
    // No checkout row yet. Either this renewal overtook `checkout.completed`
    // (Creem retries it, so it will land) or the subscription predates this
    // integration. 500 asks for a retry, by which time the row exists.
    console.warn(
      `[creem] no origin row for subscription ${event.subscriptionId}`,
    );
    return new Response("Origin row not found yet", { status: 500 });
  }

  // Same guard as the first payment: the product must match the plan.
  const expectedProduct = gateway.productIdForPlan(origin.plan as PlanId);
  if (event.productId && expectedProduct && event.productId !== expectedProduct) {
    console.error(
      `[creem] renewal product mismatch on subscription ` +
        `${event.subscriptionId}: paid ${event.productId}, plan ` +
        `"${origin.plan}" expects ${expectedProduct}`,
    );
    return new Response("Product mismatch", { status: 400 });
  }

  const isFirstPeriod = origin.period_end === null;

  if (isFirstPeriod) {
    // Same charge as the checkout — record the exact billed period on the
    // existing row instead of creating a second one. Taking the event id here
    // too means a redelivery falls into the renewal branch below and is
    // rejected by the unique index rather than inserting a phantom charge.
    const { error: fillErr } = await supabase
      .from("payment_requests")
      .update({
        period_end: event.periodEnd,
        provider_event_id: event.id,
        provider_customer_id: event.customerId,
        amount_cents: event.amountCents,
        currency: event.currency,
      })
      .eq("id", origin.id)
      .is("period_end", null);
    if (fillErr) throw fillErr;
  } else {
    // A genuine renewal gets its own row, so /admin/plati shows one line per
    // charge. The unique index on provider_event_id rejects replays.
    const { error: insertErr } = await supabase
      .from("payment_requests")
      .insert({
        user_id: origin.user_id,
        plan: origin.plan,
        selected_course_slug: origin.selected_course_slug,
        amount_mdl: origin.amount_mdl,
        provider: "creem",
        proof_via: "none",
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_notes: `Reînnoire abonament (${event.id})`,
        provider_event_id: event.id,
        provider_subscription_id: event.subscriptionId,
        provider_customer_id: event.customerId,
        period_end: event.periodEnd,
        amount_cents: event.amountCents,
        currency: event.currency,
      });

    // 23505 = unique violation on provider_event_id: the row is already there.
    // Not a reason to skip the grant — a previous delivery may have died
    // between the insert and the RPC. Re-granting is a no-op because
    // grant_subscription_until only moves the expiry forward, and replaying it
    // is exactly how that gap heals.
    if (insertErr && insertErr.code !== "23505") throw insertErr;
  }

  const { error: grantErr } = await supabase.rpc("grant_subscription_until", {
    p_user_id: origin.user_id,
    p_plan: origin.plan,
    p_course_slug: origin.selected_course_slug,
    p_expires_at: event.periodEnd,
  });
  if (grantErr) throw grantErr;

  // Only ping the owner on a genuine renewal — the first period already sent
  // both emails from handleCompleted.
  if (!isFirstPeriod) {
    await notifyUser(supabase, origin.user_id, origin.plan as PlanId, origin.amount_mdl, {
      courseSlug: origin.selected_course_slug,
      amountCharged: formatCharged(event.amountCents, event.currency),
      isRenewal: true,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/abonament");
  revalidatePath("/admin/plati");

  return Response.json({
    received: true,
    renewed: true,
    firstPeriod: isFirstPeriod,
  });
}

async function handleRefunded(event: GatewayEvent): Promise<Response> {
  if (!event.orderId && !event.subscriptionId) {
    return Response.json({ received: true, matched: false });
  }

  const supabase = createAdminClient();

  const select = "id, user_id, plan, selected_course_slug, status";

  // Only the initial checkout row has an order id — renewal rows are created
  // from `subscription.paid`, which carries no order. So a refund of a later
  // charge has to be matched on the subscription instead.
  const byOrder = event.orderId
    ? await supabase
        .from("payment_requests")
        .select(select)
        .eq("provider_order_id", event.orderId)
        .maybeSingle()
    : null;

  if (byOrder?.error) throw byOrder.error;

  const found =
    byOrder?.data ??
    (event.subscriptionId
      ? await supabase
          .from("payment_requests")
          .select(select)
          .eq("provider_subscription_id", event.subscriptionId)
          .eq("status", "approved")
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle()
          .then((r) => {
            if (r.error) throw r.error;
            return r.data;
          })
      : null);

  const row = found;
  if (!row || row.status !== "approved") {
    return Response.json({ received: true, matched: false });
  }

  const { error: revokeErr } = await supabase.rpc(
    "revoke_subscription_internal",
    {
      p_user_id: row.user_id,
      p_plan: row.plan,
      p_course_slug: row.selected_course_slug,
    },
  );
  if (revokeErr) throw revokeErr;

  // 'rejected' is the closest state the enum has — the note carries the why.
  const { error: updateErr } = await supabase
    .from("payment_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_notes: `Refund procesat, acces revocat (${event.id})`,
      provider_event_id: event.id,
    })
    .eq("id", row.id);

  if (updateErr) {
    console.error("[creem] revoked but row not marked:", updateErr);
  }

  revalidatePath("/dashboard");
  revalidatePath("/abonament");
  revalidatePath("/admin/plati");

  return Response.json({ received: true, revoked: true });
}

// -----------------------------------------------------------------------------

async function notifyUser(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  plan: PlanId,
  amountMDL: number,
  opts: { courseSlug?: string | null; amountCharged?: string; isRenewal?: boolean } = {},
): Promise<void> {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle();

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    const planName = pricingPlans.find((p) => p.id === plan)?.name ?? plan;
    const courseName = opts.courseSlug
      ? allCoursesMeta.find((c) => c.slug === opts.courseSlug)?.title.split(" — ")[0]
      : undefined;

    // The buyer's receipt — skip on renewals, they already have access.
    if (profile?.email && !opts.isRenewal) {
      await sendPaymentSuccessEmail({
        to: profile.email,
        fullName: profile.full_name,
        plan,
        amountMDL,
        accessUntil: sub?.current_period_end,
      });
    }

    // The owner's heads-up — on every cleared payment, new or renewal.
    if (profile?.email) {
      await sendOwnerPaymentEmail({
        planName,
        amountMDL,
        amountCharged: opts.amountCharged,
        customerName: profile.full_name,
        customerEmail: profile.email,
        courseName,
        isRenewal: opts.isRenewal,
      });
    }
  } catch (err) {
    console.warn("[creem] notification lookup failed:", err);
  }
}

/** "€28.00" from minor units + currency, or undefined when unknown. */
function formatCharged(cents: number | null, currency: string | null): string | undefined {
  if (cents == null || !currency) return undefined;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

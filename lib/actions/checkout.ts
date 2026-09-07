"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { gateway, isCardCheckoutEnabled } from "@/lib/payments";
import { pricingPlans } from "@/lib/content";
import { getPurchaseBlock } from "@/lib/queries/purchase";
import { siteConfig } from "@/lib/site";
import {
  startCardCheckoutSchema,
  type StartCardCheckoutInput,
} from "@/lib/validations";

export type StartCardCheckoutResult =
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
  /** The hosted checkout to send the browser to. */
  | { ok: true; url: string };

/**
 * Creates a pending `payment_requests` row, opens a Creem checkout session
 * against it, then redirects the browser to Creem's hosted page.
 *
 * Access is NOT granted here — only `app/api/webhooks/creem` grants it, after
 * verifying the signature. A user who closes the tab, forges the redirect, or
 * never pays leaves an abandoned pending row and nothing else.
 */
export async function startCardCheckoutAction(
  input: StartCardCheckoutInput,
): Promise<StartCardCheckoutResult> {
  const parsed = startCardCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      error: flat.formErrors[0] ?? "Date invalide.",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }
  const { plan, courseSlug } = parsed.data;

  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase nu e configurat." };
  }
  if (!isCardCheckoutEnabled) {
    return {
      ok: false,
      error: "Plățile sunt temporar indisponibile. Scrie-ne pe email.",
    };
  }

  const amountMDL = pricingPlans.find((p) => p.id === plan)?.priceMDL;
  if (!amountMDL) {
    return { ok: false, error: "Plan invalid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  // Refuse a purchase that would duplicate access the user already has: one
  // full plan at a time, and no second module for a course they already own.
  const block = await getPurchaseBlock(supabase, plan, courseSlug ?? null);
  if (block) {
    return { ok: false, error: block.reason };
  }

  // The row exists before the session does, so `request_id` can point at it.
  const { data: inserted, error: insertErr } = await supabase
    .from("payment_requests")
    .insert({
      user_id: user.id,
      plan,
      selected_course_slug: plan === "module" ? (courseSlug ?? null) : null,
      amount_mdl: amountMDL,
      provider: "creem",
      proof_via: "none",
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.warn("[checkout] insert failed:", insertErr?.message);
    return {
      ok: false,
      error: "Nu am putut porni plata. Reîncearcă în câteva minute.",
    };
  }

  let checkoutUrl: string;
  try {
    const session = await gateway.createCheckout({
      plan,
      requestId: inserted.id,
      customerEmail: user.email ?? undefined,
      successUrl: `${siteConfig.url}/abonament/cumpara/${plan}/confirmat`,
      metadata: {
        userId: user.id,
        plan,
        ...(courseSlug ? { courseSlug } : {}),
      },
    });

    const { error: updateErr } = await supabase
      .from("payment_requests")
      .update({ provider_session_id: session.id })
      .eq("id", inserted.id);

    if (updateErr) {
      // Not fatal: the webhook matches on request_id first, and only falls
      // back to the session id. Worth knowing about, though.
      console.warn("[checkout] session id not stored:", updateErr.message);
    }

    checkoutUrl = session.url;
  } catch (err) {
    console.warn("[checkout] Creem session failed:", err);
    // Drop the orphan so /admin/plati doesn't fill with rows that never had
    // a checkout behind them.
    await supabase.from("payment_requests").delete().eq("id", inserted.id);
    return {
      ok: false,
      error: "Procesatorul nu răspunde. Reîncearcă în câteva minute.",
    };
  }

  // Returned rather than redirect()-ed: redirect() signals by throwing
  // NEXT_REDIRECT, and crossing the server-action boundary that lands in the
  // caller's catch block, which flashed an error toast at the exact moment
  // the browser was navigating to Creem. The client does the navigation.
  return { ok: true, url: checkoutUrl };
}

export type BillingPortalResult =
  | { ok: false; error: string }
  | { ok: true; url: string };

/**
 * Resolves the caller's Creem customer id.
 *
 * Prefers the id we stored on a payment row, but falls back to looking the
 * customer up by email — so a payment made before we captured the id, or any
 * gap in the webhook, still resolves. When the fallback finds one, it is
 * written back to the user's rows so the next call is a single query.
 *
 * Returns the Supabase client alongside, since every caller needs it.
 */
async function resolveCustomerId(): Promise<
  | { ok: false; error: string }
  | { ok: true; customerId: string; userId: string }
> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase nu e configurat." };
  }
  if (!isCardCheckoutEnabled) {
    return { ok: false, error: "Plata cu cardul nu e configurată." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  // 1. Stored id (RLS keeps it to this user's own rows).
  const { data: row } = await supabase
    .from("payment_requests")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .eq("provider", "creem")
    .not("provider_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (row?.provider_customer_id) {
    return { ok: true, customerId: row.provider_customer_id, userId: user.id };
  }

  // 2. Fall back to the provider's own record, keyed by email.
  if (!user.email) {
    return { ok: false, error: "Nu găsim o plată cu cardul pe contul tău." };
  }

  let customerId: string | null;
  try {
    customerId = await gateway.findCustomerIdByEmail(user.email);
  } catch (err) {
    console.warn("[billing] customer lookup failed:", err);
    return { ok: false, error: "Procesatorul nu răspunde. Reîncearcă." };
  }

  if (!customerId) {
    return { ok: false, error: "Nu găsim o plată cu cardul pe contul tău." };
  }

  // Self-heal: stamp the id onto this user's creem rows for next time.
  await supabase
    .from("payment_requests")
    .update({ provider_customer_id: customerId })
    .eq("user_id", user.id)
    .eq("provider", "creem")
    .is("provider_customer_id", null);

  return { ok: true, customerId, userId: user.id };
}

/**
 * Opens Creem's self-service portal (change card, download invoices, cancel).
 */
export async function openBillingPortalAction(): Promise<BillingPortalResult> {
  const resolved = await resolveCustomerId();
  if (!resolved.ok) return resolved;

  try {
    const url = await gateway.createBillingPortal(resolved.customerId);
    return { ok: true, url };
  } catch (err) {
    console.warn("[billing] portal link failed:", err);
    return {
      ok: false,
      error: "Procesatorul nu răspunde. Reîncearcă în câteva minute.",
    };
  }
}

export type CancelResult =
  | { ok: false; error: string }
  /**
   * `endsAt` is when access stops; `alreadyCanceled` means the provider had no
   * live subscription left and we only caught our own records up.
   */
  | { ok: true; endsAt: string | null; alreadyCanceled: boolean };

/**
 * One-click cancel from inside the product.
 *
 * Cancels at period end ("scheduled"), so access stays live until the time the
 * student already paid for — matching what the UI promises. Our own row is
 * flagged canceled while keeping its period end, so the card can show "no more
 * renewals" without cutting access.
 *
 * The local write goes through `cancel_my_subscription` (0013). It used to be
 * a plain UPDATE on `subscriptions` from the caller's client, but that table
 * has no UPDATE policy for `authenticated`: the write matched zero rows and
 * reported no error, so Creem knew about the cancellation and we did not.
 */
export async function cancelSubscriptionAction(): Promise<CancelResult> {
  const resolved = await resolveCustomerId();
  if (!resolved.ok) return resolved;

  let subs;
  try {
    subs = await gateway.listActiveSubscriptions(resolved.customerId);
  } catch (err) {
    console.warn("[billing] list subs failed:", err);
    return { ok: false, error: "Procesatorul nu răspunde. Reîncearcă." };
  }

  let endsAt: string | null = null;
  try {
    for (const sub of subs) {
      await gateway.cancelSubscription(sub.id, "scheduled");
      endsAt = endsAt ?? sub.currentPeriodEnd;
    }
  } catch (err) {
    console.warn("[billing] cancel failed:", err);
    return { ok: false, error: "Anularea nu a reușit. Reîncearcă." };
  }

  // Runs even when the provider had nothing live left: that is the shape of an
  // earlier cancel that never made it into our database, and pressing the
  // button again is exactly how a student would try to fix it.
  const supabase = await createClient();
  const { data: canceled, error: cancelErr } = await supabase.rpc(
    "cancel_my_subscription",
  );

  if (cancelErr) {
    console.warn("[billing] local cancel failed:", cancelErr.message);
    return {
      ok: false,
      error:
        "Am oprit reînnoirea la procesator, dar starea nu s-a salvat. Reîncearcă.",
    };
  }

  const rows = canceled ?? [];
  if (subs.length === 0 && rows.length === 0) {
    return { ok: false, error: "Nu ai un abonament activ de anulat." };
  }

  endsAt =
    endsAt ?? rows.find((r) => r.ends_at)?.ends_at ?? null;

  // Access (course_access.expires_at) is left as is, so it lapses naturally at
  // period end.
  revalidatePath("/abonament");
  revalidatePath("/dashboard");
  return { ok: true, endsAt, alreadyCanceled: subs.length === 0 };
}

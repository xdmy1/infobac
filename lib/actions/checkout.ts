"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { gateway, isCardCheckoutEnabled } from "@/lib/payments";
import { pricingPlans } from "@/lib/content";
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
 * Opens Creem's self-service portal, where the customer can cancel the
 * subscription, swap the card and pull invoices.
 *
 * Creem requires cancellation to be reachable from inside the product rather
 * than through support, so this is not optional convenience — an account can
 * be rejected for its absence.
 */
export async function openBillingPortalAction(): Promise<BillingPortalResult> {
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

  // RLS keeps this to the caller's own rows, so the customer id can only ever
  // be one this user actually paid with.
  const { data: row, error } = await supabase
    .from("payment_requests")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .eq("provider", "creem")
    .not("provider_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("[billing] customer lookup failed:", error.message);
    return { ok: false, error: "Nu am putut deschide portalul. Reîncearcă." };
  }
  if (!row?.provider_customer_id) {
    return {
      ok: false,
      error: "Nu găsim o plată cu cardul pe contul tău.",
    };
  }

  let portalUrl: string;
  try {
    portalUrl = await gateway.createBillingPortal(row.provider_customer_id);
  } catch (err) {
    console.warn("[billing] portal link failed:", err);
    return {
      ok: false,
      error: "Procesatorul nu răspunde. Reîncearcă în câteva minute.",
    };
  }

  return { ok: true, url: portalUrl };
}

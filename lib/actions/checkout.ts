"use server";

import { redirect } from "next/navigation";
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
  // On success the action redirects, so callers never observe an ok:true.
  | { ok: true };

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
      error: "Plata cu cardul nu e disponibilă momentan. Folosește MIA.",
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
      error: "Procesatorul de plăți nu răspunde. Încearcă MIA sau revino.",
    };
  }

  // Outside the try — redirect() signals by throwing, and catching it here
  // would swallow the navigation.
  redirect(checkoutUrl);
}

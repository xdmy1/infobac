"use server";

// Admin-side review of payment requests. Card payments approve themselves via
// app/api/webhooks/creem — what is left here is the manual path an admin uses
// for gifts, scholarships and reconciling anything the webhook could not.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { sendEmail } from "@/lib/resend";
import { pricingPlans, type PlanId } from "@/lib/content";
import PaymentSuccessEmail from "@/emails/payment-success";

const PRICE_BY_PLAN: Record<PlanId, number> = {
  module: 250,
  all: 550,
  semester: 950,
};

function planDisplayName(planId: PlanId): string {
  return pricingPlans.find((p) => p.id === planId)?.name ?? planId;
}

function firstName(email: string, fullName?: string | null): string {
  if (fullName?.trim()) return fullName.trim().split(/\s+/)[0]!;
  return email.split("@")[0] ?? "elev";
}

// -----------------------------------------------------------------------------
// Admin actions
// -----------------------------------------------------------------------------

export type ReviewResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Approve a payment request: grant subscription + course_access via the
 * admin_grant_subscription RPC and flip the request to 'approved'. Idempotent
 * — re-approving an already-approved request just refreshes the period.
 */
export async function approvePaymentRequestAction(
  requestId: string,
  notes?: string,
): Promise<ReviewResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase nu e configurat." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat." };
  }

  // Fetch the request first (RLS lets admin SELECT all rows).
  const { data: req, error: reqErr } = await supabase
    .from("payment_requests")
    .select("id, user_id, plan, selected_course_slug, status")
    .eq("id", requestId)
    .single();

  if (reqErr || !req) {
    return { ok: false, error: "Cererea nu există." };
  }
  if (req.status !== "pending") {
    return { ok: false, error: "Cererea a fost deja procesată." };
  }

  // Grant the subscription server-side via the RPC. The RPC checks is_admin().
  const { error: grantErr } = await supabase.rpc("admin_grant_subscription", {
    p_user_id: req.user_id,
    p_plan: req.plan,
    p_course_slug: req.selected_course_slug,
  });
  if (grantErr) {
    console.warn("[payment] grant failed:", grantErr.message);
    return { ok: false, error: "Nu am putut acorda abonamentul." };
  }

  const { error: updateErr } = await supabase
    .from("payment_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      reviewed_notes: notes?.trim() || null,
    })
    .eq("id", requestId);

  if (updateErr) {
    console.warn("[payment] update status failed:", updateErr.message);
    return { ok: false, error: "Acordat, dar n-am putut marca cererea." };
  }

  revalidatePath("/admin/plati");
  revalidatePath("/abonament");
  revalidatePath("/dashboard");

  // Notify the user that access is now active. Best-effort — admin's UI ack
  // succeeds either way.
  try {
    const { data: target } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", req.user_id)
      .maybeSingle();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("current_period_end")
      .eq("user_id", req.user_id)
      .maybeSingle();

    if (target?.email) {
      const accessUntil = sub?.current_period_end
        ? new Intl.DateTimeFormat("ro-MD", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(sub.current_period_end))
        : undefined;

      sendEmail({
        to: target.email,
        subject: "Accesul tău e activ — InfoBac",
        react: (
          <PaymentSuccessEmail
            name={firstName(target.email, target.full_name)}
            plan={planDisplayName(req.plan)}
            amountMDL={PRICE_BY_PLAN[req.plan]}
            accessUntil={accessUntil}
          />
        ),
        tags: [
          { name: "type", value: "payment-success" },
          { name: "plan", value: req.plan },
        ],
      }).catch((err) => {
        console.warn("[payment] payment-success email failed:", err);
      });
    }
  } catch (err) {
    console.warn("[payment] post-approval email lookup failed:", err);
  }

  return { ok: true };
}

export async function rejectPaymentRequestAction(
  requestId: string,
  reason?: string,
): Promise<ReviewResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase nu e configurat." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat." };
  }

  const { error } = await supabase
    .from("payment_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      reviewed_notes: reason?.trim() || null,
    })
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) {
    console.warn("[payment] reject failed:", error.message);
    return { ok: false, error: "Nu am putut respinge cererea." };
  }

  revalidatePath("/admin/plati");
  return { ok: true };
}

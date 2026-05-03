"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { sendEmail } from "@/lib/resend";
import { pricingPlans, type PlanId } from "@/lib/content";
import { allCoursesMeta, type CourseSlug } from "@/lib/content/courses";
import PaymentPendingEmail from "@/emails/payment-pending";
import PaymentSuccessEmail from "@/emails/payment-success";

const PRICE_BY_PLAN: Record<PlanId, number> = {
  module: 250,
  all: 550,
  semester: 950,
};

function planDisplayName(planId: PlanId): string {
  return pricingPlans.find((p) => p.id === planId)?.name ?? planId;
}

function courseDisplayName(
  slug: CourseSlug | null | undefined,
): string | undefined {
  if (!slug) return undefined;
  const meta = allCoursesMeta.find((c) => c.slug === slug);
  return meta?.title.split(" — ")[0];
}

function firstName(email: string, fullName?: string | null): string {
  if (fullName?.trim()) return fullName.trim().split(/\s+/)[0]!;
  return email.split("@")[0] ?? "elev";
}

const VALID_COURSE_SLUGS: ReadonlySet<CourseSlug> = new Set([
  "python",
  "sql",
  "devices",
]);

const MAX_PROOF_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED_PROOF_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export type SubmitPaymentResult =
  | { ok: true; requestId: string }
  | { ok: false; error: string };

interface SubmitPaymentInput {
  plan: PlanId;
  /** Required when plan = "module". */
  selectedCourseSlug?: CourseSlug;
  proofVia: "upload" | "telegram";
  /** When proofVia = "upload" — the screenshot file. */
  proofFile?: File | null;
  userNotes?: string;
}

/**
 * Creates a `payment_requests` row in pending state and (when proofVia
 * = "upload") puts the screenshot in Supabase Storage at
 * `payment-proofs/<user_id>/<request_id>.<ext>`.
 *
 * Validates plan + course + file size + mime type before touching the DB.
 */
export async function submitPaymentRequestAction(
  input: SubmitPaymentInput,
): Promise<SubmitPaymentResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase nu e configurat." };
  }

  if (!(input.plan in PRICE_BY_PLAN)) {
    return { ok: false, error: "Plan invalid." };
  }
  if (input.plan === "module") {
    if (!input.selectedCourseSlug || !VALID_COURSE_SLUGS.has(input.selectedCourseSlug)) {
      return { ok: false, error: "Alege un curs înainte." };
    }
  }
  if (input.proofVia !== "upload" && input.proofVia !== "telegram") {
    return { ok: false, error: "Tip dovadă invalid." };
  }

  // Validate file early
  if (input.proofVia === "upload") {
    const f = input.proofFile;
    if (!f || f.size === 0) {
      return { ok: false, error: "Încarcă screenshot-ul plății." };
    }
    if (f.size > MAX_PROOF_BYTES) {
      return { ok: false, error: "Fișierul e prea mare (max 6 MB)." };
    }
    if (!ALLOWED_PROOF_TYPES.has(f.type)) {
      return { ok: false, error: "Format acceptat: JPG, PNG, WEBP, PDF." };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  // Insert pending request first to get an id we can use in the file path.
  const { data: inserted, error: insertErr } = await supabase
    .from("payment_requests")
    .insert({
      user_id: user.id,
      plan: input.plan,
      selected_course_slug:
        input.plan === "module" ? input.selectedCourseSlug ?? null : null,
      amount_mdl: PRICE_BY_PLAN[input.plan],
      proof_via: input.proofVia,
      user_notes: input.userNotes?.trim() || null,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.warn("[payment] insert failed:", insertErr?.message);
    return {
      ok: false,
      error: "Nu am putut salva cererea. Reîncearcă în câteva minute.",
    };
  }

  // Upload proof if applicable.
  if (input.proofVia === "upload" && input.proofFile) {
    const ext = guessExt(input.proofFile.type) || "bin";
    const path = `${user.id}/${inserted.id}.${ext}`;
    const buffer = await input.proofFile.arrayBuffer();
    const { error: uploadErr } = await supabase.storage
      .from("payment-proofs")
      .upload(path, buffer, {
        contentType: input.proofFile.type,
        upsert: true,
      });
    if (uploadErr) {
      console.warn("[payment] proof upload failed:", uploadErr.message);
      // Roll back the request so the admin doesn't see a request without proof
      // when the user thought they had one.
      await supabase.from("payment_requests").delete().eq("id", inserted.id);
      return {
        ok: false,
        error: "Upload-ul a eșuat. Verifică fișierul și reîncearcă.",
      };
    }
    await supabase
      .from("payment_requests")
      .update({ proof_path: path })
      .eq("id", inserted.id);
  }

  revalidatePath("/abonament");
  revalidatePath("/admin/plati");

  // Confirmation email — non-blocking. If Resend is misconfigured or fails
  // we still return ok=true so the UX redirects to /confirmat as expected.
  if (user.email) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    sendEmail({
      to: user.email,
      subject: "Am primit cererea ta de plată — InfoBac",
      react: (
        <PaymentPendingEmail
          name={firstName(user.email, profile?.full_name)}
          planName={planDisplayName(input.plan)}
          amountMDL={PRICE_BY_PLAN[input.plan]}
          selectedCourse={courseDisplayName(input.selectedCourseSlug)}
        />
      ),
      tags: [
        { name: "type", value: "payment-pending" },
        { name: "plan", value: input.plan },
      ],
    }).catch((err) => {
      console.warn("[payment] payment-pending email failed:", err);
    });
  }

  return { ok: true, requestId: inserted.id };
}

function guessExt(mime: string): string | null {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return null;
  }
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

export async function redirectToCheckout(plan: PlanId, courseSlug?: string) {
  // Helper for when /preturi forms post — the form action calls this and
  // the user lands on /abonament/cumpara/<plan>?course=<slug>.
  const params = new URLSearchParams();
  if (courseSlug) params.set("course", courseSlug);
  redirect(
    `/abonament/cumpara/${plan}${params.size ? `?${params.toString()}` : ""}`,
  );
}

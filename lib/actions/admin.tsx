"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";
import { sendEmail } from "@/lib/resend";
import PaymentReminderEmail from "@/emails/payment-reminder";
import {
  grantSubscriptionSchema,
  notifyPaymentSchema,
  suspendUserSchema,
  unsuspendUserSchema,
  type GrantSubscriptionInput,
  type NotifyPaymentInput,
  type SuspendUserInput,
  type UnsuspendUserInput,
} from "@/lib/validations";

type ActionResult<TMode extends string = string> =
  | { ok: true; mode: TMode }
  | { ok: false; error: string };

/**
 * Resolve the current request's Supabase client and verify the caller is an
 * admin. Returns a typed handle on success or a structured error result.
 *
 * Mirrors the structure used in lib/actions/profile.ts:80-86 for the
 * unauthenticated case and adds a role check via the SQL is_admin() helper.
 */
async function assertAdmin() {
  if (isPreviewMode) {
    return {
      ok: false as const,
      error: "Admin nu e disponibil în preview mode.",
    };
  }
  if (!isSupabaseConfigured) {
    return {
      ok: false as const,
      error: "Supabase nu e configurat — nu putem executa acțiuni.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false as const,
      error: "Sesiunea a expirat. Re-loghează-te.",
    };
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) {
    return {
      ok: false as const,
      error: "Nu ai permisiunea pentru această acțiune.",
    };
  }

  return { ok: true as const, supabase, user };
}

// -----------------------------------------------------------------------------
// suspendUserAction — revoke all course_access rows for a target user.
//
// An active subscription webhook may re-grant access on its next event; that's
// intentional. Suspend means "cut access right now"; the notify-payment email
// nudges the user to re-pay.
// -----------------------------------------------------------------------------
export async function suspendUserAction(
  input: SuspendUserInput
): Promise<ActionResult<"suspended">> {
  const parsed = suspendUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const { error } = await guard.supabase
    .from("course_access")
    .delete()
    .eq("user_id", parsed.data.userId);

  if (error) {
    console.error("[admin] suspend error:", error);
    return { ok: false, error: "Nu am putut suspenda utilizatorul." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${parsed.data.userId}`);
  return { ok: true, mode: "suspended" };
}

// -----------------------------------------------------------------------------
// unsuspendUserAction — bulk grant every course back. Idempotent via the
// unique(user_id, course_id) constraint on course_access.
// -----------------------------------------------------------------------------
export async function unsuspendUserAction(
  input: UnsuspendUserInput
): Promise<ActionResult<"restored">> {
  const parsed = unsuspendUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const { data: courses, error: coursesErr } = await guard.supabase
    .from("courses")
    .select("id");
  if (coursesErr) {
    console.error("[admin] unsuspend (courses) error:", coursesErr);
    return { ok: false, error: "Nu am putut citi lista de cursuri." };
  }
  if (!courses || courses.length === 0) {
    return { ok: false, error: "Nu există cursuri în baza de date." };
  }

  const now = new Date().toISOString();
  const rows = courses.map((c) => ({
    user_id: parsed.data.userId,
    course_id: c.id,
    granted_at: now,
    expires_at: null,
    source: "manual" as const,
    source_id: null,
    note: "admin unsuspend",
  }));

  // upsert with ignoreDuplicates makes this idempotent on (user_id, course_id).
  const { error } = await guard.supabase
    .from("course_access")
    .upsert(rows, { onConflict: "user_id,course_id", ignoreDuplicates: true });

  if (error) {
    console.error("[admin] unsuspend error:", error);
    return { ok: false, error: "Nu am putut restaura accesul." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${parsed.data.userId}`);
  return { ok: true, mode: "restored" };
}

// -----------------------------------------------------------------------------
// grantCourseAccessAction — give a single user access to one specific course
// for N days (or lifetime). Used from /admin/<userId> when the admin wants to
// hand-pick a course outside the standard "approve a payment request" flow —
// e.g. a scholarship, a bug-bounty thank-you, or a friend.
// -----------------------------------------------------------------------------

const VALID_COURSE_SLUGS = new Set(["python", "sql", "devices"]);
const VALID_DURATIONS = new Set([30, 180, 0]); // 0 = lifetime
const VALID_SOURCES = new Set([
  "manual",
  "gift",
  "scholarship",
] as const);

type GrantCourseSource = "manual" | "gift" | "scholarship";

export interface GrantCourseInput {
  userId: string;
  courseSlug: string;
  /** Days until expiry. 0 = lifetime (no expires_at). */
  durationDays: number;
  source: GrantCourseSource;
  note?: string;
}

export async function grantCourseAccessAction(
  input: GrantCourseInput,
): Promise<ActionResult<"granted">> {
  if (
    typeof input.userId !== "string" ||
    !VALID_COURSE_SLUGS.has(input.courseSlug) ||
    !VALID_DURATIONS.has(input.durationDays) ||
    !VALID_SOURCES.has(input.source)
  ) {
    return { ok: false, error: "Date invalide." };
  }

  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  // Look up the course UUID from the slug.
  const { data: course, error: courseErr } = await guard.supabase
    .from("courses")
    .select("id")
    .eq("slug", input.courseSlug)
    .maybeSingle();
  if (courseErr || !course) {
    return { ok: false, error: "Cursul nu există în baza de date." };
  }

  const now = new Date();
  const expiresAt =
    input.durationDays === 0
      ? null
      : new Date(now.getTime() + input.durationDays * 24 * 60 * 60 * 1000)
          .toISOString();

  const { error } = await guard.supabase
    .from("course_access")
    .upsert(
      {
        user_id: input.userId,
        course_id: course.id,
        granted_at: now.toISOString(),
        expires_at: expiresAt,
        source: input.source,
        source_id: null,
        note: input.note?.trim() || null,
      },
      { onConflict: "user_id,course_id" },
    );

  if (error) {
    console.error("[admin] grant course error:", error);
    return { ok: false, error: "Nu am putut acorda accesul." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${input.userId}`);
  revalidatePath("/dashboard");
  return { ok: true, mode: "granted" };
}

// -----------------------------------------------------------------------------
// grantSubscriptionAction — give a user one of the 3 subscription plans
// (module / all / semester). Wraps the SQL admin_grant_subscription RPC which
// inserts a subscription row + the right course_access rows in one shot.
//
// For 'module' the admin must pass a courseSlug. For 'all' / 'semester' the
// slug is ignored. Period: 30/30/180 days (encoded in the SQL function).
// -----------------------------------------------------------------------------
export async function grantSubscriptionAction(
  input: GrantSubscriptionInput,
): Promise<ActionResult<"granted">> {
  const parsed = grantSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const { error } = await guard.supabase.rpc("admin_grant_subscription", {
    p_user_id: parsed.data.userId,
    p_plan: parsed.data.plan,
    p_course_slug: parsed.data.plan === "module" ? parsed.data.courseSlug! : null,
  });

  if (error) {
    console.error("[admin] grant subscription error:", error);
    return { ok: false, error: "Nu am putut acorda abonamentul." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${parsed.data.userId}`);
  revalidatePath("/dashboard");
  return { ok: true, mode: "granted" };
}

// -----------------------------------------------------------------------------
// revokeCourseAccessAction — remove a single (user, course) row from
// course_access. Less destructive than suspendUserAction (which wipes all).
// -----------------------------------------------------------------------------
export async function revokeCourseAccessAction(input: {
  userId: string;
  accessId: string;
}): Promise<ActionResult<"revoked">> {
  if (
    typeof input.userId !== "string" ||
    typeof input.accessId !== "string"
  ) {
    return { ok: false, error: "Date invalide." };
  }

  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const { error } = await guard.supabase
    .from("course_access")
    .delete()
    .eq("id", input.accessId)
    .eq("user_id", input.userId);

  if (error) {
    console.error("[admin] revoke course error:", error);
    return { ok: false, error: "Nu am putut revoca accesul." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${input.userId}`);
  return { ok: true, mode: "revoked" };
}

// -----------------------------------------------------------------------------
// notifyPaymentAction — email the target user a "you must pay" reminder.
// -----------------------------------------------------------------------------
export async function notifyPaymentAction(
  input: NotifyPaymentInput
): Promise<ActionResult<"sent" | "dev">> {
  const parsed = notifyPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const { data: target, error: targetErr } = await guard.supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", parsed.data.userId)
    .maybeSingle();

  if (targetErr || !target) {
    console.error("[admin] notify (lookup) error:", targetErr);
    return { ok: false, error: "Nu am găsit utilizatorul." };
  }

  const result = await sendEmail({
    to: target.email,
    subject: "Plata abonamentului — accesul tău e suspendat temporar",
    react: (
      <PaymentReminderEmail
        name={target.full_name.split(" ")[0] ?? target.full_name}
        message={parsed.data.message}
      />
    ),
    tags: [{ name: "type", value: "payment-reminder" }],
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, mode: result.mode };
}

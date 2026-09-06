import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PlanId } from "@/lib/content";
import type { CourseSlug } from "@/lib/content/courses";

type Client = SupabaseClient<Database>;

export interface PurchaseBlock {
  /** Why this plan can't be bought right now — user-facing, Romanian. */
  reason: string;
  /** When the blocking access ends, if known (ISO). */
  until: string | null;
}

const FULL_PLANS: ReadonlySet<PlanId> = new Set(["all", "semester"]);

function fmt(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("ro-MD", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Decides whether the signed-in user may buy `plan` (for `courseSlug` when it's
 * the single-module plan), or returns why not.
 *
 * The account can hold at most one full plan (`all` / `semester`) at a time —
 * "one or the other". A single module can be bought per course, but not for a
 * course the user already has access to, whether from another module or from
 * an active full plan. Access itself is read from `my_courses`, the same view
 * the rest of the app trusts, so a full plan naturally blocks a redundant
 * module.
 *
 * Returns null when the purchase is allowed.
 */
export async function getPurchaseBlock(
  client: Client,
  plan: PlanId,
  courseSlug?: CourseSlug | null,
): Promise<PurchaseBlock | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null; // The action re-checks auth; nothing to block on.

  if (FULL_PLANS.has(plan)) {
    // A live, non-cancelled full plan blocks buying either full plan again.
    // A cancelled-but-still-active plan does not — that is a re-subscribe.
    const { data: sub } = await client
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", user.id)
      .in("plan", ["all", "semester"])
      .eq("status", "active")
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    const active =
      sub &&
      (sub.current_period_end === null ||
        new Date(sub.current_period_end).getTime() > Date.now());

    if (active) {
      const label = sub.plan === "semester" ? "Pachet 6 luni" : "Toate modulele";
      const until = fmt(sub.current_period_end);
      return {
        reason: `Ai deja un plan complet activ (${label})${
          until ? `, până la ${until}` : ""
        }. Poți avea un singur plan complet — îl gestionezi din Abonament.`,
        until: sub.current_period_end,
      };
    }
    return null;
  }

  // Single module: block only if this exact course is already active.
  if (!courseSlug) return null; // validation elsewhere catches the missing slug.

  const { data: course } = await client
    .from("my_courses")
    .select("title, expires_at, is_active")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (course?.is_active) {
    const until = fmt(course.expires_at);
    const name = course.title?.split(" — ")[0] ?? "acest curs";
    return {
      reason: `Ai deja acces la ${name}${until ? `, până la ${until}` : ""}.`,
      until: course.expires_at,
    };
  }
  return null;
}

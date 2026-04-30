import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];
type CourseAccessRow = Database["public"]["Tables"]["course_access"]["Row"];
type QuizAttemptRow = Database["public"]["Tables"]["quiz_attempts"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

export interface AdminUserSummary {
  profile: ProfileRow;
  accessCount: number;
  totalCourses: number;
  bestScore: number | null;
  attemptsCount: number;
  latestSubscription: SubscriptionRow | null;
  lastActivityAt: string | null;
}

export interface AdminUserDetail {
  profile: ProfileRow;
  subscriptions: SubscriptionRow[];
  courseAccess: Array<
    CourseAccessRow & { course: Pick<CourseRow, "slug" | "title"> | null }
  >;
  attempts: QuizAttemptRow[];
}

/**
 * Admin overview list. Relies on admin RLS policies (0006) granting SELECT
 * on profiles / subscriptions / course_access / quiz_attempts.
 *
 * Strategy: 4 parallel selects + JS-side aggregation. Avoids the ceremony
 * of a DB view (would require a hand-maintained Views entry in types.ts).
 */
export async function listAllUsers(
  client: Client
): Promise<AdminUserSummary[]> {
  const [profiles, subs, access, attempts, courses] = await Promise.all([
    client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    client
      .from("subscriptions")
      .select("*")
      .order("current_period_start", { ascending: false }),
    client.from("course_access").select("user_id, course_id"),
    client
      .from("quiz_attempts")
      .select("user_id, score, completed_at")
      .not("score", "is", null)
      .not("completed_at", "is", null),
    client.from("courses").select("id"),
  ]);

  if (profiles.error) throw profiles.error;
  if (subs.error) throw subs.error;
  if (access.error) throw access.error;
  if (attempts.error) throw attempts.error;
  if (courses.error) throw courses.error;

  const totalCourses = courses.data?.length ?? 0;

  const accessByUser = new Map<string, Set<string>>();
  for (const row of access.data ?? []) {
    const set = accessByUser.get(row.user_id) ?? new Set<string>();
    set.add(row.course_id);
    accessByUser.set(row.user_id, set);
  }

  const subsByUser = new Map<string, SubscriptionRow>();
  for (const row of subs.data ?? []) {
    if (!subsByUser.has(row.user_id)) subsByUser.set(row.user_id, row);
  }

  const bestByUser = new Map<string, number>();
  const lastByUser = new Map<string, string>();
  const countByUser = new Map<string, number>();
  for (const row of attempts.data ?? []) {
    if (typeof row.score === "number") {
      const prev = bestByUser.get(row.user_id) ?? -1;
      if (row.score > prev) bestByUser.set(row.user_id, row.score);
    }
    if (row.completed_at) {
      const prev = lastByUser.get(row.user_id);
      if (!prev || row.completed_at > prev) {
        lastByUser.set(row.user_id, row.completed_at);
      }
    }
    countByUser.set(row.user_id, (countByUser.get(row.user_id) ?? 0) + 1);
  }

  return (profiles.data ?? []).map<AdminUserSummary>((p) => ({
    profile: p,
    accessCount: accessByUser.get(p.id)?.size ?? 0,
    totalCourses,
    bestScore: bestByUser.get(p.id) ?? null,
    attemptsCount: countByUser.get(p.id) ?? 0,
    latestSubscription: subsByUser.get(p.id) ?? null,
    lastActivityAt: lastByUser.get(p.id) ?? null,
  }));
}

/**
 * Drill-down for a single user. Returns null if no profile (deleted user).
 */
export async function getUserDetail(
  client: Client,
  userId: string
): Promise<AdminUserDetail | null> {
  const [profile, subs, access, attempts] = await Promise.all([
    client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(),
    client
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("current_period_start", { ascending: false }),
    // Embed courses via the FK on course_access.course_id → courses.id.
    // Cast required because the hand-maintained `Relationships: []` keeps
    // PostgREST embeds untyped.
    client
      .from("course_access")
      .select("*, course:courses(slug, title)")
      .eq("user_id", userId)
      .order("granted_at", { ascending: false }),
    client
      .from("quiz_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false, nullsFirst: false }),
  ]);

  if (profile.error) throw profile.error;
  if (subs.error) throw subs.error;
  if (access.error) throw access.error;
  if (attempts.error) throw attempts.error;

  if (!profile.data) return null;

  return {
    profile: profile.data,
    subscriptions: subs.data ?? [],
    courseAccess:
      (access.data as unknown as AdminUserDetail["courseAccess"]) ?? [],
    attempts: attempts.data ?? [],
  };
}

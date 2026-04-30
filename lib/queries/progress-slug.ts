import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

/**
 * Returns the set of `lesson_slug` values the current user has marked
 * complete for a given course. Used to render checkmarks and pick the
 * "current" lesson on course pages.
 *
 * Slug-based progress lives in `lesson_progress` (see migration 0004).
 * Returns an empty set on guest / error so the UI degrades gracefully.
 */
export async function getCompletedLessonSlugs(
  client: Client,
  courseSlug: string,
): Promise<Set<string>> {
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return new Set();

    const { data, error } = await client
      .from("lesson_progress")
      .select("lesson_slug")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .not("completed_at", "is", null);

    if (error) {
      console.warn("[progress-slug] fetch failed:", error.message);
      return new Set();
    }
    const slugs = new Set<string>();
    for (const row of data ?? []) {
      if (row.lesson_slug) slugs.add(row.lesson_slug);
    }
    return slugs;
  } catch (e) {
    console.warn("[progress-slug] error:", e);
    return new Set();
  }
}

export interface ExamAttemptSummary {
  bestScore: number;
  attempts: number;
  lastAttemptAt: string | null;
}

/**
 * Returns the user's best simulation score and total attempts for a course.
 */
export async function getExamSummary(
  client: Client,
  courseSlug: string,
): Promise<ExamAttemptSummary> {
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return { bestScore: 0, attempts: 0, lastAttemptAt: null };

    const { data, error } = await client
      .from("quiz_attempts")
      .select("score, completed_at")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("mode", "exam");

    if (error) {
      console.warn("[exam-summary] fetch failed:", error.message);
      return { bestScore: 0, attempts: 0, lastAttemptAt: null };
    }
    let best = 0;
    let last: string | null = null;
    for (const r of data ?? []) {
      const s = r.score ?? 0;
      if (s > best) best = s;
      if (r.completed_at && (!last || r.completed_at > last))
        last = r.completed_at;
    }
    return { bestScore: best, attempts: (data ?? []).length, lastAttemptAt: last };
  } catch {
    return { bestScore: 0, attempts: 0, lastAttemptAt: null };
  }
}

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  lastTouchedAt: string | null;
}

/**
 * Per-course progress summaries for the current user.
 * Returns one row per course the user has touched lessons in.
 *
 * Note: counts only lessons the user can read (RLS gates this), so for a
 * non-subscribed user this naturally caps at the 2 free preview lessons.
 */
export async function getCourseProgressMap(
  client: Client,
  courseIds: string[]
): Promise<Record<string, CourseProgressSummary>> {
  if (courseIds.length === 0) return {};

  const [lessonsRes, progressRes] = await Promise.all([
    client
      .from("lessons")
      .select("id, course_id")
      .in("course_id", courseIds),
    client
      .from("lesson_progress")
      .select("lesson_id, completed_at, updated_at"),
  ]);

  if (lessonsRes.error) throw lessonsRes.error;
  if (progressRes.error) throw progressRes.error;

  const lessons = lessonsRes.data ?? [];
  const progress = progressRes.data ?? [];

  // lesson_id -> course_id
  const lessonCourse = new Map(
    lessons.map((l) => [l.id, l.course_id as string])
  );

  // course_id -> totalLessons
  const totals = new Map<string, number>();
  for (const l of lessons) {
    totals.set(l.course_id as string, (totals.get(l.course_id as string) ?? 0) + 1);
  }

  // course_id -> { completed, lastTouched }
  const stats = new Map<
    string,
    { completed: number; lastTouchedAt: string | null }
  >();
  for (const p of progress) {
    const courseId = lessonCourse.get(p.lesson_id as string);
    if (!courseId) continue;

    const cur = stats.get(courseId) ?? { completed: 0, lastTouchedAt: null };
    if (p.completed_at) cur.completed += 1;
    const ts = p.updated_at as string;
    if (!cur.lastTouchedAt || ts > cur.lastTouchedAt) {
      cur.lastTouchedAt = ts;
    }
    stats.set(courseId, cur);
  }

  const out: Record<string, CourseProgressSummary> = {};
  for (const courseId of courseIds) {
    const total = totals.get(courseId) ?? 0;
    const stat = stats.get(courseId) ?? {
      completed: 0,
      lastTouchedAt: null,
    };
    const percent =
      total > 0 ? Math.round((stat.completed / total) * 100) : 0;
    out[courseId] = {
      courseId,
      totalLessons: total,
      completedLessons: stat.completed,
      percent,
      lastTouchedAt: stat.lastTouchedAt,
    };
  }

  return out;
}

/**
 * Most recent lesson the user touched (for "Continuă unde ai rămas" CTA).
 */
export async function getLastTouchedLesson(client: Client) {
  const { data, error } = await client
    .from("lesson_progress")
    .select(
      `
      lesson_id,
      updated_at,
      completed_at,
      lessons (
        id,
        slug,
        title,
        course_id,
        courses (slug, title, icon)
      )
    `
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

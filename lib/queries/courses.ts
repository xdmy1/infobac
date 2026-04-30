import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type MyCourseRow = Database["public"]["Views"]["my_courses"]["Row"];
export type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
export type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];

/**
 * All courses (public catalog) ordered by pathway position.
 * Used by /cursuri marketing page when we move it to fetch from DB.
 */
export async function getCourses(client: Client) {
  const { data, error } = await client
    .from("courses")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Courses the current user has access to (joins course_access).
 * Empty array if user has no grants.
 */
export async function getMyCourses(client: Client) {
  const { data, error } = await client
    .from("my_courses")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * One course by slug, with its lessons. Returns null if not found.
 * Lessons RLS gating still applies — preview lessons are visible to anyone,
 * full set only if user has course access.
 */
export async function getCourseWithLessons(client: Client, slug: string) {
  const { data: course, error: courseErr } = await client
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (courseErr) throw courseErr;
  if (!course) return null;

  const { data: lessons, error: lessonsErr } = await client
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  if (lessonsErr) throw lessonsErr;

  return { course, lessons: lessons ?? [] };
}

/**
 * One lesson by course slug + lesson slug-or-id. Used by lesson page.
 */
export async function getLesson(
  client: Client,
  courseSlug: string,
  lessonSlugOrId: string
) {
  const { data: course, error: courseErr } = await client
    .from("courses")
    .select("id, slug, title, icon")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseErr) throw courseErr;
  if (!course) return null;

  // Treat lessonSlugOrId as either slug or UUID; match either.
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      lessonSlugOrId
    );

  const query = client
    .from("lessons")
    .select("*")
    .eq("course_id", course.id);

  const { data: lesson, error: lessonErr } = await (isUuid
    ? query.eq("id", lessonSlugOrId)
    : query.eq("slug", lessonSlugOrId)
  ).maybeSingle();

  if (lessonErr) throw lessonErr;
  if (!lesson) return null;

  return { course, lesson };
}

/**
 * Check whether the current authenticated user has access to a course.
 * Calls the SQL function has_course_access(course_id).
 */
export async function checkCourseAccess(client: Client, courseId: string) {
  const { data, error } = await client.rpc("has_course_access", {
    p_course_id: courseId,
  });

  if (error) throw error;
  return data === true;
}

/**
 * All quizzes belonging to a course. RLS gates which ones are visible.
 */
export async function getCourseQuizzes(client: Client, courseId: string) {
  const { data, error } = await client
    .from("quizzes")
    .select("*")
    .eq("course_id", courseId)
    .order("type", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Lesson IDs the current user has marked as completed (within a course).
 */
export async function getCompletedLessonIds(
  client: Client,
  lessonIds: string[]
): Promise<Set<string>> {
  if (lessonIds.length === 0) return new Set();
  const { data, error } = await client
    .from("lesson_progress")
    .select("lesson_id, completed_at")
    .in("lesson_id", lessonIds)
    .not("completed_at", "is", null);

  if (error) throw error;
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

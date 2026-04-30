"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

export type LessonProgressResult =
  | { ok: true; mode: "preview" | "saved" | "guest" }
  | { ok: false; error: string };

/**
 * Marks a lesson complete. Lessons live in static TS modules now, so
 * progress is keyed by (course_slug, lesson_slug) instead of a UUID.
 *
 * Falls through silently for guests / preview / missing Supabase so the
 * lesson page still navigates to the next lesson without an error toast.
 */
export async function markLessonCompleteAction(
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonProgressResult> {
  if (
    typeof courseSlug !== "string" ||
    courseSlug.length === 0 ||
    typeof lessonSlug !== "string" ||
    lessonSlug.length === 0
  ) {
    return { ok: false, error: "Lecție invalidă." };
  }

  if (isPreviewMode) {
    return { ok: true, mode: "preview" };
  }

  if (!isSupabaseConfigured) {
    return { ok: true, mode: "guest" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: true, mode: "guest" };
    }

    const now = new Date().toISOString();
    // Upsert keyed by the partial unique index (user_id, course_slug, lesson_slug)
    // — see migration 0004_slug_progress.sql.
    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: null,
          course_slug: courseSlug,
          lesson_slug: lessonSlug,
          completed_at: now,
          time_spent_seconds: 0,
          updated_at: now,
        },
        { onConflict: "user_id,course_slug,lesson_slug" },
      );

    if (error) {
      console.warn("[lesson] markComplete failed:", error.message);
      return { ok: false, error: "Nu am putut salva progresul." };
    }

    revalidatePath(`/curs/${courseSlug}`);
    revalidatePath("/dashboard");

    return { ok: true, mode: "saved" };
  } catch (e) {
    console.warn("[lesson] error:", e);
    return { ok: false, error: "Nu am putut salva progresul." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

export type ExamSubmitInput = {
  courseSlug: string;
  mode: "exam";
  score: number;
  correctCount: number;
  totalQuestions: number;
};

export type ExamSubmitResult =
  | { ok: true; mode: "saved" | "preview" | "guest" }
  | { ok: false; error: string };

/**
 * Persists an exam-mode quiz attempt for the current user, keyed by course
 * slug (not legacy quiz_id). Practice attempts are NOT stored — they are
 * meant for self-paced learning.
 *
 * Falls through silently in preview mode or for guests; never throws so the
 * UI's result view always renders.
 */
export async function submitExamAttemptAction(
  input: ExamSubmitInput,
): Promise<ExamSubmitResult> {
  if (input.mode !== "exam") {
    return { ok: true, mode: "preview" };
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

    // The quiz_attempts table accepts NULL quiz_id when course_slug is set.
    // See migration 0004_slug_progress.sql.
    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      quiz_id: null,
      course_slug: input.courseSlug,
      mode: input.mode,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      score: input.score,
      answers: {
        correctCount: input.correctCount,
        totalQuestions: input.totalQuestions,
      },
    });

    if (error) {
      console.warn("[quiz-attempt] insert failed:", error.message);
      return { ok: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/curs/${input.courseSlug}`);
    return { ok: true, mode: "saved" };
  } catch (e) {
    console.warn("[quiz-attempt] error:", e);
    return { ok: false, error: "Nu am putut salva încercarea." };
  }
}

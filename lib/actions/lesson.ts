"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

export type LessonProgressResult =
  | { ok: true; mode: "preview" | "saved" }
  | { ok: false; error: string };

export async function markLessonCompleteAction(
  lessonId: string,
  courseSlug: string
): Promise<LessonProgressResult> {
  if (typeof lessonId !== "string" || lessonId.length === 0) {
    return { ok: false, error: "Lecție invalidă." };
  }

  if (isPreviewMode) {
    // No persistence in preview mode — UI confirms locally.
    return { ok: true, mode: "preview" };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Nu putem salva progresul — Supabase nu e configurat.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: now,
        time_spent_seconds: 0,
        updated_at: now,
      },
      { onConflict: "user_id,lesson_id" }
    );

  if (error) {
    console.error("[lesson] markComplete error:", error);
    return { ok: false, error: "Nu am putut salva progresul. Reîncearcă." };
  }

  revalidatePath(`/curs/${courseSlug}`);
  revalidatePath("/dashboard");

  return { ok: true, mode: "saved" };
}

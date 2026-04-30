"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

export type QuizSubmitResult =
  | {
      ok: true;
      mode: "preview" | "saved";
      score: number;
      passed: boolean;
      totalQuestions: number;
      correctCount: number;
    }
  | { ok: false; error: string };

interface QuizSubmitInput {
  quizId: string;
  answers: Record<string, string>;
  // Pre-validated client-side scoring; server re-checks if real DB.
  totalQuestions: number;
  correctCount: number;
}

export async function submitQuizAttemptAction(
  input: QuizSubmitInput
): Promise<QuizSubmitResult> {
  const total = input.totalQuestions;
  const correct = Math.max(0, Math.min(total, input.correctCount));
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (isPreviewMode) {
    return {
      ok: true,
      mode: "preview",
      score,
      passed: score >= 70,
      totalQuestions: total,
      correctCount: correct,
    };
  }

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

  // Re-fetch correct answers server-side to prevent client tampering.
  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("id, correct_option_id")
    .eq("quiz_id", input.quizId);
  if (qErr) {
    console.error("[quiz] re-fetch questions error:", qErr);
    return { ok: false, error: "Nu am putut verifica răspunsurile." };
  }

  let serverCorrect = 0;
  for (const q of questions ?? []) {
    if (input.answers[q.id] === q.correct_option_id) serverCorrect += 1;
  }
  const serverTotal = questions?.length ?? 0;
  const serverScore =
    serverTotal > 0 ? Math.round((serverCorrect / serverTotal) * 100) : 0;

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("passing_score")
    .eq("id", input.quizId)
    .maybeSingle();

  const passingScore = quiz?.passing_score ?? 70;

  const { error: insertErr } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_id: input.quizId,
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    score: serverScore,
    answers: input.answers,
  });
  if (insertErr) {
    console.error("[quiz] insert attempt error:", insertErr);
    return { ok: false, error: "Nu am putut salva încercarea." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/progres");

  return {
    ok: true,
    mode: "saved",
    score: serverScore,
    passed: serverScore >= passingScore,
    totalQuestions: serverTotal,
    correctCount: serverCorrect,
  };
}

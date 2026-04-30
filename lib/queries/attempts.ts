import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type QuizAttemptWithQuiz =
  Database["public"]["Tables"]["quiz_attempts"]["Row"] & {
    quiz: {
      title: string;
      type: Database["public"]["Tables"]["quizzes"]["Row"]["type"];
      course_id: string;
    } | null;
  };

export async function getRecentQuizAttempts(
  client: Client,
  limit = 10
): Promise<QuizAttemptWithQuiz[]> {
  const { data, error } = await client
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(title, type, course_id)
    `
    )
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as QuizAttemptWithQuiz[]) ?? [];
}

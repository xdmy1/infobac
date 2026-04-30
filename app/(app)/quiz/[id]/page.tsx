import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/app/quiz-player";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode, findPreviewQuiz } from "@/lib/preview-mode";
import type { Database } from "@/lib/supabase/types";

type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];
type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type CourseLite = Pick<
  Database["public"]["Tables"]["courses"]["Row"],
  "id" | "slug" | "title" | "icon"
>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return {
    title: "Quiz",
    robots: { index: false, follow: false },
  };
}

export default async function QuizPage({ params }: PageProps) {
  const { id } = await params;

  let quiz: QuizRow | null = null;
  let questions: QuestionRow[] = [];
  let course: CourseLite | null = null;

  if (isPreviewMode) {
    const found = findPreviewQuiz(id);
    if (!found) notFound();
    quiz = found.quiz;
    questions = found.questions;
    course = found.course;
  } else {
    const supabase = await createClient();
    const { data: q, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !q) notFound();

    const [questionsRes, courseRes] = await Promise.all([
      supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", q.id)
        .order("order_index", { ascending: true }),
      supabase
        .from("courses")
        .select("id, slug, title, icon")
        .eq("id", q.course_id)
        .maybeSingle(),
    ]);

    quiz = q;
    questions = questionsRes.data ?? [];
    course = courseRes.data;
  }

  if (!quiz || !course) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <QuizPlayer
        quiz={quiz}
        questions={questions}
        courseSlug={course.slug}
        courseTitle={course.title}
        courseIcon={course.icon}
      />
    </div>
  );
}

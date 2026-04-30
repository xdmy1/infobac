import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/app/quiz/quiz-session";
import { getCourseContent } from "@/lib/content/courses";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const EXAM_QUESTION_COUNT = 50;
const EXAM_DURATION_MIN = 60;

function pickN<T>(arr: readonly T[], n: number): T[] {
  if (arr.length <= n) return [...arr];
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, n);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourseContent(slug);
  return {
    title: c ? `Examen · ${c.meta.title}` : `Examen · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();

  const subset = pickN(content.questions, EXAM_QUESTION_COUNT);

  return (
    <QuizSession
      mode="exam"
      courseSlug={content.meta.slug}
      courseTitle={content.meta.title}
      questions={subset}
      examDurationSeconds={EXAM_DURATION_MIN * 60}
      passingScore={content.meta.passingScore}
    />
  );
}

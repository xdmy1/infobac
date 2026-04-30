import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/app/quiz/quiz-session";
import { getCourseContent } from "@/lib/content/courses";
import { getExamSet } from "@/lib/content/courses/exam-sets";

interface PageProps {
  params: Promise<{ slug: string; n: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, n } = await params;
  const c = getCourseContent(slug);
  return {
    title: c ? `Examen ${n} · ${c.meta.title}` : `Examen ${n}`,
    robots: { index: false, follow: false },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug, n } = await params;
  const examNumber = Number.parseInt(n, 10);
  if (!Number.isInteger(examNumber) || examNumber < 1) notFound();

  const content = getCourseContent(slug);
  if (!content) notFound();

  const set = getExamSet(content.meta.slug, examNumber);
  if (!set) notFound();

  return (
    <QuizSession
      mode="exam"
      courseSlug={content.meta.slug}
      courseTitle={`${content.meta.title.split(" — ")[0]} · ${set.label}`}
      questions={set.questions}
      examDurationSeconds={set.durationMin * 60}
      passingScore={content.meta.passingScore}
      examSetNumber={set.number}
    />
  );
}

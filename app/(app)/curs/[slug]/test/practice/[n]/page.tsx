import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/app/quiz/quiz-session";
import { getCourseContent } from "@/lib/content/courses";
import { getTestSet } from "@/lib/content/courses/exam-sets";

interface PageProps {
  params: Promise<{ slug: string; n: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, n } = await params;
  const c = getCourseContent(slug);
  return {
    title: c ? `Practice ${n} · ${c.meta.title}` : `Practice ${n}`,
    robots: { index: false, follow: false },
  };
}

export default async function PracticePage({ params }: PageProps) {
  const { slug, n } = await params;
  const setNumber = Number.parseInt(n, 10);
  if (!Number.isInteger(setNumber) || setNumber < 1) notFound();

  const content = getCourseContent(slug);
  if (!content) notFound();

  const set = getTestSet(content.meta.slug, setNumber);
  if (!set) notFound();

  return (
    <QuizSession
      mode="practice"
      courseSlug={content.meta.slug}
      courseTitle={`${content.meta.title.split(" — ")[0]} · Practice ${set.number}`}
      questions={set.questions}
      passingScore={content.meta.passingScore}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/app/quiz/quiz-session";
import { getCourseContent } from "@/lib/content/courses";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourseContent(slug);
  return {
    title: c ? `Practice · ${c.meta.title}` : `Practice · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function PracticePage({ params }: PageProps) {
  const { slug } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();

  return (
    <QuizSession
      mode="practice"
      courseSlug={content.meta.slug}
      courseTitle={content.meta.title}
      questions={[...content.questions]}
      passingScore={content.meta.passingScore}
    />
  );
}

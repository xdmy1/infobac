import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModePicker } from "@/components/app/quiz/mode-picker";
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
    title: c ? `Test · ${c.meta.title}` : `Test · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function TestModePage({ params }: PageProps) {
  const { slug } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();

  return (
    <ModePicker course={content.meta} questionCount={content.questions.length} />
  );
}

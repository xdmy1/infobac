import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModePicker } from "@/components/app/quiz/mode-picker";
import { TestPaywall } from "@/components/app/test-paywall";
import { getCourseContent } from "@/lib/content/courses";
import { getTestSetsForCourse } from "@/lib/content/courses/exam-sets";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourseContent(slug);
  return {
    title: c ? `Teste · ${c.meta.title}` : `Teste · ${slug}`,
    robots: { index: false, follow: false },
  };
}

interface AnswersWithMode {
  setNumber?: number | null;
}

export default async function TestModePage({ params }: PageProps) {
  const { slug } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();

  const sets = getTestSetsForCourse(content.meta.slug).map((s) => ({
    number: s.number,
    questionCount: s.questions.length,
    durationMin: s.durationMin,
  }));

  // Gate: tests require active course_access. Preview mode bypasses.
  let hasAccess = isPreviewMode;
  const examBestByN: Record<number, number> = {};
  const practiceBestByN: Record<number, number> = {};

  if (!isPreviewMode) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: ok } = await supabase.rpc("has_course_access_by_slug", {
          p_slug: content.meta.slug,
        });
        hasAccess = ok === true;

        const { data } = await supabase
          .from("quiz_attempts")
          .select("score, mode, answers")
          .eq("user_id", user.id)
          .eq("course_slug", content.meta.slug);
        for (const row of data ?? []) {
          const ans = (row.answers ?? {}) as AnswersWithMode;
          const n = ans.setNumber;
          const score = row.score ?? 0;
          if (typeof n !== "number") continue;
          if (row.mode === "exam") {
            if (!examBestByN[n] || score > examBestByN[n]) examBestByN[n] = score;
          } else if (row.mode === "practice") {
            if (!practiceBestByN[n] || score > practiceBestByN[n]) practiceBestByN[n] = score;
          }
        }
      }
    } catch {
      // best-effort; UI still renders
    }
  }

  if (!hasAccess) {
    return <TestPaywall course={content.meta} whatLocked="Toate testele" />;
  }

  return (
    <ModePicker
      course={content.meta}
      totalQuestions={content.questions.length}
      sets={sets}
      examBestByN={examBestByN}
      practiceBestByN={practiceBestByN}
    />
  );
}

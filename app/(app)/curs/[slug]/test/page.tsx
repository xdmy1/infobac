import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModePicker } from "@/components/app/quiz/mode-picker";
import { getCourseContent } from "@/lib/content/courses";
import { getExamSetsForCourse } from "@/lib/content/courses/exam-sets";
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
    title: c ? `Test · ${c.meta.title}` : `Test · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function TestModePage({ params }: PageProps) {
  const { slug } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();

  const sets = getExamSetsForCourse(content.meta.slug);
  const examSets = sets.map((s) => ({
    number: s.number,
    label: s.label,
    questionCount: s.questions.length,
    durationMin: s.durationMin,
  }));

  // Best score per exam set, where available. We tag exam attempts with
  // mode='exam' but don't currently distinguish between exam set numbers
  // — for now, leave bestScoreByExam undefined (no badge). Future: add a
  // `set_number` column or tag in answers JSON.
  let bestScoreByExam: Record<number, number> | undefined;
  if (!isPreviewMode) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("quiz_attempts")
          .select("score, answers")
          .eq("user_id", user.id)
          .eq("course_slug", content.meta.slug)
          .eq("mode", "exam");
        if (data) {
          const map: Record<number, number> = {};
          for (const row of data) {
            const ans = (row.answers ?? {}) as { setNumber?: number };
            const n = ans.setNumber;
            const s = row.score ?? 0;
            if (typeof n === "number" && (!map[n] || s > map[n])) {
              map[n] = s;
            }
          }
          bestScoreByExam = map;
        }
      }
    } catch {
      // best-effort; UI still renders
    }
  }

  return (
    <ModePicker
      course={content.meta}
      totalQuestions={content.questions.length}
      examSets={examSets}
      bestScoreByExam={bestScoreByExam}
    />
  );
}

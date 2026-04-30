import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { LessonContent } from "@/components/app/lesson-content";
import { LessonActions } from "@/components/app/lesson-actions";
import { ReadingProgress } from "@/components/app/reading-progress";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CourseIcon } from "@/components/shared/course-icon";
import { getLesson, getCourseWithLessons } from "@/lib/queries/courses";
import { createClient } from "@/lib/supabase/server";
import {
  isPreviewMode,
  findPreviewLesson,
  previewLessonsByCourse,
  previewCompletedLessonIds,
} from "@/lib/preview-mode";
import type { Database } from "@/lib/supabase/types";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type CourseLite = Pick<
  Database["public"]["Tables"]["courses"]["Row"],
  "id" | "slug" | "title" | "icon"
>;

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Lecție · ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, id } = await params;

  let course: CourseLite | null = null;
  let lesson: LessonRow | null = null;
  let allLessons: Pick<LessonRow, "id" | "slug" | "order_index" | "title">[] = [];
  let alreadyCompleted = false;

  if (isPreviewMode) {
    const found = findPreviewLesson(slug, id);
    if (!found) notFound();
    course = found.course;
    lesson = found.lesson;
    allLessons = previewLessonsByCourse[slug] ?? [];
    alreadyCompleted = previewCompletedLessonIds.has(found.lesson.id);
  } else {
    const supabase = await createClient();
    const found = await getLesson(supabase, slug, id);
    if (!found) notFound();
    course = found.course;
    lesson = found.lesson;

    const courseData = await getCourseWithLessons(supabase, slug);
    allLessons = courseData?.lessons ?? [];

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("lesson_progress")
        .select("completed_at")
        .eq("user_id", user.id)
        .eq("lesson_id", lesson.id)
        .maybeSingle();
      alreadyCompleted = !!data?.completed_at;
    }
  }

  if (!course || !lesson) notFound();

  const sortedLessons = [...allLessons].sort(
    (a, b) => a.order_index - b.order_index
  );
  const idx = sortedLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? sortedLessons[idx - 1] : null;
  const next = idx >= 0 && idx < sortedLessons.length - 1
    ? sortedLessons[idx + 1]
    : null;

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
        <Reveal variant="fade-down">
          <nav
            className="flex items-center gap-2 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link
              href={`/curs/${slug}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <CourseIcon slug={course.slug} src={course.icon} size={14} alt="" />
              {course.title}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">
              Lecția {lesson.order_index}
            </span>
          </nav>
        </Reveal>

        <Reveal staggerChildren={0.1} delay={0.15} className="mt-7">
          <RevealItem variant="fade-blur">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              {lesson.title}
            </h1>
          </RevealItem>
          <RevealItem variant="fade-up">
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">
                Lecția {lesson.order_index}
                {sortedLessons.length > 0 && ` din ${sortedLessons.length}`}
              </span>
              {lesson.duration_minutes > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {lesson.duration_minutes} min
                  </span>
                </>
              )}
            </div>
          </RevealItem>
        </Reveal>

        <Reveal variant="fade-up" delay={0.4} className="mt-10">
          <LessonContent markdown={lesson.content} />
        </Reveal>

        <hr className="my-12 border-border" />

        <Reveal variant="fade-up">
          <LessonActions
            lessonId={lesson.id}
            courseSlug={slug}
            alreadyCompleted={alreadyCompleted}
            prevHref={prev ? `/curs/${slug}/lectia/${prev.slug}` : null}
            nextHref={next ? `/curs/${slug}/lectia/${next.slug}` : null}
          />
        </Reveal>
      </div>
    </>
  );
}

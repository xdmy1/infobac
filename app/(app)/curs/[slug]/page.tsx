import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LessonList, type LessonListItem } from "@/components/app/lesson-list";
import { QuizList } from "@/components/app/quiz-list";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CourseIcon } from "@/components/shared/course-icon";
import {
  getCourseWithLessons,
  getCourseQuizzes,
  getCompletedLessonIds,
  checkCourseAccess,
} from "@/lib/queries/courses";
import { createClient } from "@/lib/supabase/server";
import {
  isPreviewMode,
  previewCoursesFull,
  previewLessonsByCourse,
  previewQuizzesByCourse,
  previewCompletedLessonIds,
} from "@/lib/preview-mode";
import type { Database } from "@/lib/supabase/types";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Curs ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;

  let course: CourseRow | null = null;
  let lessons: LessonRow[] = [];
  let quizzes: QuizRow[] = [];
  let completedLessonIds: Set<string> = new Set();
  let hasAccess = false;

  if (isPreviewMode) {
    course = previewCoursesFull[slug] ?? null;
    lessons = previewLessonsByCourse[slug] ?? [];
    quizzes = previewQuizzesByCourse[slug] ?? [];
    completedLessonIds = previewCompletedLessonIds;
    hasAccess = true;
  } else {
    const supabase = await createClient();
    const result = await getCourseWithLessons(supabase, slug);
    if (!result) notFound();
    course = result.course;
    lessons = result.lessons;

    const [accessRes, quizzesRes, completedRes] = await Promise.all([
      checkCourseAccess(supabase, course.id).catch(() => false),
      getCourseQuizzes(supabase, course.id).catch(() => []),
      getCompletedLessonIds(
        supabase,
        lessons.map((l) => l.id)
      ).catch(() => new Set<string>()),
    ]);
    hasAccess = accessRes;
    quizzes = quizzesRes;
    completedLessonIds = completedRes;
  }

  if (!course) notFound();

  const totalCount = lessons.length;
  const completedCount = lessons.filter((l) =>
    completedLessonIds.has(l.id)
  ).length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // First non-completed lesson is the "current" one.
  const currentLessonId =
    lessons.find((l) => !completedLessonIds.has(l.id))?.id;

  const lessonListItems: LessonListItem[] = lessons.map((l) => {
    const isCompleted = completedLessonIds.has(l.id);
    const isPreviewLesson = l.order_index <= 2;
    const isLocked = !hasAccess && !isPreviewLesson;
    const state: LessonListItem["state"] = isLocked
      ? "locked"
      : isCompleted
        ? "completed"
        : l.id === currentLessonId
          ? "current"
          : "available";
    return {
      id: l.id,
      slug: l.slug,
      title: l.title,
      duration_minutes: l.duration_minutes,
      order_index: l.order_index,
      state,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <Reveal variant="fade-down">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard
        </Link>
      </Reveal>

      <header className="mt-7 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Reveal staggerChildren={0.1} className="space-y-4">
          <RevealItem
            variant="scale-in"
            className="flex items-center gap-4"
          >
            <CourseIcon slug={course.slug} src={course.icon} size={72} alt="" />
            <Badge variant="outline" className="font-mono text-[10px]">
              {course.estimated_duration || "Durată flexibilă"}
            </Badge>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              {course.title}
            </h1>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
              {course.description}
            </p>
          </RevealItem>
        </Reveal>

        {!hasAccess && totalCount > 0 && (
          <Reveal variant="fade-down" delay={0.4}>
            <Link
              href="/preturi"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
            >
              <BookOpen className="size-3.5" />
              Deblochează acest curs
            </Link>
          </Reveal>
        )}
      </header>

      {totalCount > 0 && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Progres curs
            </p>
            <p className="font-mono text-sm font-bold tabular-nums">
              {percent}%
            </p>
          </div>
          <Progress value={percent} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {completedCount}
            </span>{" "}
            din {totalCount} lecții completate
          </p>
        </section>
      )}

      <Reveal variant="fade-up" delay={0.4} className="mt-12 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Lecții
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasAccess
              ? "Toate lecțiile sunt disponibile. Continuă în orice ordine vrei."
              : "Primele 2 lecții sunt gratuite. Restul sunt disponibile după ce activezi cursul."}
          </p>
        </div>
        <LessonList courseSlug={slug} lessons={lessonListItems} />
      </Reveal>

      <Reveal variant="fade-up" delay={0.2} className="mt-12 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Quiz-uri și simulări
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Auto-evaluare după lecții + simulări complete identice cu examenul
            Certiport real.
          </p>
        </div>
        <QuizList quizzes={quizzes} />
      </Reveal>

      <section className="mt-12 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-5">
        <Clock className="size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Estimat să termini cursul:{" "}
          <span className="font-medium text-foreground">
            {course.estimated_duration || "depinde de ritmul tău"}
          </span>
          . Mai puțin dacă ai deja experiență.
        </p>
      </section>
    </div>
  );
}

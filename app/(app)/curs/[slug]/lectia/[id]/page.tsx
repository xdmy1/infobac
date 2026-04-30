import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { LessonContent } from "@/components/app/lesson-content";
import { LessonActions } from "@/components/app/lesson-actions";
import { ReadingProgress } from "@/components/app/reading-progress";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CourseIcon } from "@/components/shared/course-icon";
import { getCourseContent } from "@/lib/content/courses";
import { getCompletedLessonSlugs } from "@/lib/queries/progress-slug";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const c = getCourseContent(slug);
  const lesson = c?.lessons.find((l) => l.slug === id);
  return {
    title: lesson ? `${lesson.title} · ${c?.meta.title}` : `Lecție · ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, id } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();

  const lesson = content.lessons.find((l) => l.slug === id);
  if (!lesson) notFound();

  let alreadyCompleted = false;
  if (!isPreviewMode) {
    try {
      const supabase = await createClient();
      const completedSet = await getCompletedLessonSlugs(supabase, slug);
      alreadyCompleted = completedSet.has(lesson.slug);
    } catch {
      // ignore
    }
  }

  const sorted = [...content.lessons].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const idx = sorted.findIndex((l) => l.slug === lesson.slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto w-full max-w-3xl min-w-0 px-3 py-8 sm:px-4 md:px-6 md:py-14 lg:px-8">
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
              <CourseIcon
                slug={content.meta.slug}
                src={content.meta.icon}
                size={14}
                alt=""
              />
              {content.meta.title}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">Lecția {lesson.orderIndex}</span>
          </nav>
        </Reveal>

        <Reveal staggerChildren={0.1} delay={0.15} className="mt-6 md:mt-7">
          <RevealItem variant="fade-blur">
            <h1 className="text-balance break-words text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {lesson.title}
            </h1>
          </RevealItem>
          <RevealItem variant="fade-up">
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">
                Lecția {lesson.orderIndex} din {sorted.length}
              </span>
              {lesson.durationMinutes > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {lesson.durationMinutes} min
                </span>
              )}
            </div>
          </RevealItem>
        </Reveal>

        <Reveal variant="fade-up" delay={0.4} className="mt-10">
          <LessonContent markdown={lesson.markdown} />
        </Reveal>

        <hr className="my-12 border-border" />

        <Reveal variant="fade-up">
          <LessonActions
            courseSlug={slug}
            lessonSlug={lesson.slug}
            alreadyCompleted={alreadyCompleted}
            prevHref={prev ? `/curs/${slug}/lectia/${prev.slug}` : null}
            nextHref={next ? `/curs/${slug}/lectia/${next.slug}` : null}
          />
        </Reveal>
      </div>
    </>
  );
}

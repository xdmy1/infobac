import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Target,
  Trophy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import { getCourseContent } from "@/lib/content/courses";
import { getCompletedLessonSlugs } from "@/lib/queries/progress-slug";
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
    title: c ? `${c.meta.title} · InfoBac` : `Curs ${slug}`,
    description: c?.meta.blurb,
    robots: { index: false, follow: false },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const content = getCourseContent(slug);
  if (!content) notFound();
  const { meta, lessons, questions } = content;

  let completed = new Set<string>();
  let hasAccess = true; // preview mode shows everything; access gating only kicks in with real Supabase
  if (!isPreviewMode) {
    try {
      const supabase = await createClient();
      completed = await getCompletedLessonSlugs(supabase, slug);
      const { data: ok } = await supabase.rpc("has_course_access_by_slug", {
        p_slug: slug,
      });
      hasAccess = ok === true;
    } catch {
      // ignore — assume gated, show preview-only view
      hasAccess = false;
    }
  }

  const totalCount = lessons.length;
  const completedCount = lessons.filter((l) => completed.has(l.slug)).length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentLesson = lessons.find(
    (l) => !completed.has(l.slug) && (hasAccess || l.isPreview)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 md:px-6 md:py-14 lg:px-8">
      <Reveal variant="fade-down">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard
        </Link>
      </Reveal>

      <header className="mt-6 flex flex-col gap-5 md:mt-7 md:flex-row md:items-start md:justify-between md:gap-6">
        <Reveal staggerChildren={0.08} className="space-y-4">
          <RevealItem variant="scale-in" className="flex flex-wrap items-center gap-3 md:gap-4">
            <CourseIcon slug={meta.slug} src={meta.icon} size={56} alt="" />
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-[10px]">
                {meta.duration}
              </Badge>
              <Badge
                variant="outline"
                className="border-accent/40 bg-accent/5 font-mono text-[10px] capitalize text-accent"
              >
                {meta.difficulty}
              </Badge>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {totalCount} lecții · {questions.length} întrebări
              </span>
            </div>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {meta.title}
            </h1>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
              {meta.description}
            </p>
          </RevealItem>
        </Reveal>

        <Reveal variant="fade-down" delay={0.3} className="md:shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            {!hasAccess ? (
              <Link
                href="/preturi"
                className={cn(
                  buttonVariants(),
                  "h-11 gap-2 px-5 text-sm font-semibold",
                )}
              >
                <Lock className="size-4" />
                Vezi prețuri
              </Link>
            ) : currentLesson ? (
              <Link
                href={`/curs/${meta.slug}/lectia/${currentLesson.slug}`}
                className={cn(
                  buttonVariants(),
                  "h-11 gap-2 px-5 text-sm font-semibold",
                )}
              >
                <PlayCircle className="size-4" />
                Continuă lecția
              </Link>
            ) : (
              <Link
                href={`/curs/${meta.slug}/test`}
                className={cn(
                  buttonVariants(),
                  "h-11 gap-2 px-5 text-sm font-semibold",
                )}
              >
                <Trophy className="size-4" />
                Mergi la test
              </Link>
            )}
            <Link
              href={`/curs/${meta.slug}/test`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 gap-2 px-4 text-sm",
              )}
            >
              <Target className="size-3.5" />
              <span className="truncate">Toate testele · {questions.length} întrebări</span>
            </Link>
          </div>
        </Reveal>
      </header>

      {!hasAccess && (
        <section className="mt-8 flex flex-col gap-3 rounded-2xl border border-warning/40 bg-warning/5 p-5 md:flex-row md:items-center md:gap-5 md:p-6">
          <Lock className="size-5 shrink-0 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-bold tracking-tight">
              Acces suspendat
            </p>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Primele {lessons.filter((l) => l.isPreview).length} lecții rămân
              gratuite. Pentru a continua întreg cursul și a da testele, alege
              un plan.
            </p>
          </div>
          <Link
            href="/preturi"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 gap-1.5 px-4 text-sm font-semibold",
            )}
          >
            Vezi prețuri
            <ArrowRight className="size-3.5" />
          </Link>
        </section>
      )}

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
            <span className="font-medium text-foreground">{completedCount}</span>{" "}
            din {totalCount} lecții completate
          </p>
        </section>
      )}

      <Reveal variant="fade-up" delay={0.3} className="mt-12 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Lecții
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Materialul e structurat pe capitole scurte. Primele {lessons.filter((l) => l.isPreview).length} sunt gratuite — restul sunt deblocate când activezi cursul.
          </p>
        </div>
        <ol className="overflow-hidden rounded-2xl border border-border bg-card">
          {lessons.map((l) => {
            const isDone = completed.has(l.slug);
            const isLocked = !hasAccess && !l.isPreview;
            return (
              <li key={l.slug} className="border-b border-border last:border-b-0">
                <Link
                  href={`/curs/${meta.slug}/lectia/${l.slug}`}
                  className={cn(
                    "group flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-muted/40 sm:gap-4 sm:px-4 md:px-6",
                    isLocked && "pointer-events-none opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold tabular-nums",
                      isDone
                        ? "border-success/50 bg-success/10 text-success"
                        : isLocked
                          ? "border-border bg-muted text-muted-foreground"
                          : "border-border bg-card text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="size-4" />
                    ) : isLocked ? (
                      <Lock className="size-3.5" />
                    ) : (
                      String(l.orderIndex).padStart(2, "0")
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 break-words text-sm font-semibold text-foreground">
                      {l.title}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {l.durationMinutes} min
                      </span>
                      {l.isPreview && (
                        <span className="rounded-full bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                          Free preview
                        </span>
                      )}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            );
          })}
        </ol>
      </Reveal>

      <Reveal variant="fade-up" delay={0.2} className="mt-12 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Test pentru curs
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Două moduri: practice cu feedback instant, sau examen simulat ca la
            Certiport.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Link
            href={`/curs/${meta.slug}/test`}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Target className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Practice</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Răspuns instant, explicație după fiecare întrebare. Fără timp.
              </p>
            </div>
            <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
          <Link
            href={`/curs/${meta.slug}/test`}
            className="group flex items-start gap-4 rounded-2xl border border-primary/30 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Examen simulat</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Cronometru, rezultat la final, scor salvat. Trec ≥ {meta.passingScore}%.
              </p>
            </div>
            <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        </div>
      </Reveal>

      <section className="mt-12 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-5">
        <BookOpen className="size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Materialul e bazat pe întrebări reale de la examenul Certiport. Citește
          lecțiile, dă practice până nu mai greșești, apoi simulează examenul.
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Target, Trophy, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CourseIcon } from "@/components/shared/course-icon";
import { createClient } from "@/lib/supabase/server";
import {
  getCompletedLessonSlugs,
  getExamSummary,
} from "@/lib/queries/progress-slug";
import { isPreviewMode } from "@/lib/preview-mode";
import { allCoursesMeta, getCourseContent } from "@/lib/content/courses";
import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";

export const metadata: Metadata = {
  title: "Progres",
  robots: { index: false, follow: false },
};

interface CourseProgress {
  completedLessons: number;
  totalLessons: number;
  percent: number;
  bestScore: number;
  attempts: number;
  lastAttemptAt: string | null;
}

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "acum";
  if (minutes < 60) return `acum ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `acum ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ieri";
  if (days < 7) return `acum ${days} zile`;
  return d.toLocaleDateString("ro-MD", {
    day: "numeric",
    month: "short",
  });
}

export default async function ProgresPage() {
  const stats: Record<string, CourseProgress> = {};

  if (isPreviewMode) {
    for (const c of allCoursesMeta) {
      const total = getCourseContent(c.slug)?.lessons.length ?? 0;
      stats[c.slug] = {
        completedLessons: 0,
        totalLessons: total,
        percent: 0,
        bestScore: 0,
        attempts: 0,
        lastAttemptAt: null,
      };
    }
  } else {
    const supabase = await createClient();
    await Promise.all(
      allCoursesMeta.map(async (c) => {
        const total = getCourseContent(c.slug)?.lessons.length ?? 0;
        const [completed, exam] = await Promise.all([
          getCompletedLessonSlugs(supabase, c.slug),
          getExamSummary(supabase, c.slug),
        ]);
        stats[c.slug] = {
          completedLessons: completed.size,
          totalLessons: total,
          percent: total === 0 ? 0 : Math.round((completed.size / total) * 100),
          bestScore: exam.bestScore,
          attempts: exam.attempts,
          lastAttemptAt: exam.lastAttemptAt,
        };
      }),
    );
  }

  const totalCompleted = Object.values(stats).reduce(
    (a, s) => a + s.completedLessons,
    0,
  );
  const totalLessons = Object.values(stats).reduce(
    (a, s) => a + s.totalLessons,
    0,
  );
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const totalAttempts = Object.values(stats).reduce((a, s) => a + s.attempts, 0);
  const bestOverall = Math.max(0, ...Object.values(stats).map((s) => s.bestScore));

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <Reveal staggerChildren={0.1}>
        <RevealItem variant="fade-up">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Progres
          </p>
        </RevealItem>
        <RevealItem variant="fade-blur">
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Cum stai cu pregătirea.
          </h1>
        </RevealItem>
      </Reveal>

      <Reveal
        staggerChildren={0.08}
        delay={0.2}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <RevealItem variant="fade-up">
          <StatCard
            icon={<TrendingUp className="size-5" />}
            label="Progres global"
            value={
              <>
                <CountUp to={overallPercent} />%
              </>
            }
            accent="primary"
          />
        </RevealItem>
        <RevealItem variant="fade-up">
          <StatCard
            icon={<CheckCircle2 className="size-5" />}
            label="Lecții completate"
            value={
              <>
                <CountUp to={totalCompleted} />/{totalLessons || "—"}
              </>
            }
            accent="success"
          />
        </RevealItem>
        <RevealItem variant="fade-up">
          <StatCard
            icon={<Target className="size-5" />}
            label="Examene date"
            value={<CountUp to={totalAttempts} />}
            accent="accent"
          />
        </RevealItem>
        <RevealItem variant="fade-up">
          <StatCard
            icon={<Trophy className="size-5" />}
            label="Cel mai bun scor"
            value={
              bestOverall > 0 ? (
                <>
                  <CountUp to={bestOverall} />%
                </>
              ) : (
                "—"
              )
            }
            accent="warning"
          />
        </RevealItem>
      </Reveal>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Progres per curs
        </h2>
        <ul className="space-y-3">
          {allCoursesMeta.map((c) => {
            const s = stats[c.slug];
            return (
              <li
                key={c.slug}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center md:p-5"
              >
                <CourseIcon slug={c.slug} src={c.icon} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/curs/${c.slug}`}
                      className="text-sm font-semibold hover:underline md:text-base"
                    >
                      {c.title.split(" — ")[0]}
                    </Link>
                    <span className="font-mono text-xs font-bold tabular-nums">
                      {s.percent}%
                    </span>
                  </div>
                  <Progress value={s.percent} className="mt-2 h-1.5" />
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {s.completedLessons} din {s.totalLessons} lecții
                    </span>
                    {s.attempts > 0 && (
                      <span>
                        ·{" "}
                        <span
                          className={cn(
                            "font-mono font-semibold",
                            s.bestScore >= c.passingScore
                              ? "text-success"
                              : "text-warning",
                          )}
                        >
                          {s.bestScore}%
                        </span>{" "}
                        cel mai bun ({s.attempts} încercări)
                      </span>
                    )}
                    {s.lastAttemptAt && (
                      <span>· ultima: {formatRelative(s.lastAttemptAt)}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent: "primary" | "accent" | "success" | "warning";
}) {
  const accentMap: Record<typeof accent, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span
        className={cn(
          "mb-3 inline-flex size-9 items-center justify-center rounded-lg",
          accentMap[accent],
        )}
        aria-hidden
      >
        {icon}
      </span>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

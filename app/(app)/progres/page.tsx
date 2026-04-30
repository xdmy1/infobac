import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Target, Trophy, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { getMyCourses } from "@/lib/queries/courses";
import { getCourseProgressMap } from "@/lib/queries/progress";
import { getRecentQuizAttempts, type QuizAttemptWithQuiz } from "@/lib/queries/attempts";
import {
  isPreviewMode,
  previewCourses,
  previewProgressMap,
  previewQuizAttempts,
} from "@/lib/preview-mode";
import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";

export const metadata: Metadata = {
  title: "Progres",
  robots: { index: false, follow: false },
};

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
  let courses: { id: string; slug: string; title: string; icon: string }[];
  let progressMap: Record<
    string,
    { totalLessons: number; completedLessons: number; percent: number }
  >;
  let attempts: QuizAttemptWithQuiz[];

  if (isPreviewMode) {
    courses = previewCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      icon: c.icon,
    }));
    progressMap = previewProgressMap;
    attempts = previewQuizAttempts as unknown as QuizAttemptWithQuiz[];
  } else {
    const supabase = await createClient();
    const myCourses = await getMyCourses(supabase);
    courses = myCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      icon: c.icon,
    }));

    const courseIds = courses.map((c) => c.id);
    const [pm, recents] = await Promise.all([
      courseIds.length
        ? getCourseProgressMap(supabase, courseIds).catch(() => ({}))
        : Promise.resolve({}),
      getRecentQuizAttempts(supabase, 10).catch(() => []),
    ]);
    progressMap = pm as typeof progressMap;
    attempts = recents;
  }

  const totalCompleted = Object.values(progressMap).reduce(
    (acc, p) => acc + (p.completedLessons ?? 0),
    0
  );
  const totalLessons = Object.values(progressMap).reduce(
    (acc, p) => acc + (p.totalLessons ?? 0),
    0
  );
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const completedAttempts = attempts.filter((a) => a.score !== null);
  const passedCount = completedAttempts.filter(
    (a) => (a.score ?? 0) >= 70
  ).length;
  const avgScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((acc, a) => acc + (a.score ?? 0), 0) /
            completedAttempts.length
        )
      : 0;

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
                <CountUp to={totalCompleted} />/
                {totalLessons || "—"}
              </>
            }
            accent="success"
          />
        </RevealItem>
        <RevealItem variant="fade-up">
          <StatCard
            icon={<Target className="size-5" />}
            label="Quiz-uri date"
            value={<CountUp to={completedAttempts.length} />}
            accent="accent"
          />
        </RevealItem>
        <RevealItem variant="fade-up">
          <StatCard
            icon={<Trophy className="size-5" />}
            label="Scor mediu"
            value={
              completedAttempts.length > 0 ? (
                <>
                  <CountUp to={avgScore} />%
                </>
              ) : (
                "—"
              )
            }
            sub={
              completedAttempts.length > 0
                ? `${passedCount} promovate`
                : "Niciun quiz încă"
            }
            accent="warning"
          />
        </RevealItem>
      </Reveal>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Progres per curs
        </h2>
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            Niciun curs activ. Vezi{" "}
            <Link href="/preturi" className="font-medium text-foreground underline">
              prețurile
            </Link>{" "}
            ca să începi.
          </div>
        ) : (
          <ul className="space-y-3">
            {courses.map((c) => {
              const stats = progressMap[c.id];
              const percent = stats?.percent ?? 0;
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center md:p-5"
                >
                  <span className="text-3xl leading-none" aria-hidden>
                    {c.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        href={`/curs/${c.slug}`}
                        className="text-sm font-semibold hover:underline md:text-base"
                      >
                        {c.title}
                      </Link>
                      <span className="font-mono text-xs font-bold tabular-nums">
                        {percent}%
                      </span>
                    </div>
                    <Progress value={percent} className="mt-2 h-1.5" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stats?.completedLessons ?? 0} din{" "}
                      {stats?.totalLessons ?? 0} lecții
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Quiz-uri recente
        </h2>
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            Nu ai dat niciun quiz încă. Începe cu unul din{" "}
            <Link href="/dashboard" className="font-medium text-foreground underline">
              dashboard
            </Link>
            .
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-border bg-card">
            {attempts.map((a, i) => {
              const score = a.score ?? 0;
              const passed = score >= 70;
              return (
                <li
                  key={a.id}
                  className={cn(
                    "flex items-center justify-between gap-3 px-4 py-3.5 md:px-5",
                    i !== attempts.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {a.quiz?.title ?? "Quiz"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelative(a.completed_at ?? a.started_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                      passed
                        ? "bg-success/15 text-success"
                        : "bg-warning/15 text-warning"
                    )}
                  >
                    {score}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
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
          accentMap[accent]
        )}
        aria-hidden
      >
        {icon}
      </span>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

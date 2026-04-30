import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries/user";
import { getActiveSubscription } from "@/lib/queries/subscription";
import { getCompletedLessonSlugs } from "@/lib/queries/progress-slug";
import { getOverallStats } from "@/lib/queries/stats";
import {
  isPreviewMode,
  previewProfile,
  previewSubscription,
} from "@/lib/preview-mode";
import {
  allCoursesMeta,
  getCourseContent,
  type CourseSlug,
} from "@/lib/content/courses";
import type { SubscriptionRow } from "@/lib/queries/subscription";
import { SubscriptionStatusCard } from "@/components/app/subscription-status-card";
import { PasswordResetToast } from "@/components/app/password-reset-toast";
import { Progress } from "@/components/ui/progress";
import { CourseIcon } from "@/components/shared/course-icon";
import { StatsHero } from "@/components/app/stats/stats-hero";
import { StrengthsWeaknesses } from "@/components/app/stats/strengths-weaknesses";
import { TopicAccuracyList } from "@/components/app/stats/topic-accuracy-list";
import { RecentActivity } from "@/components/app/stats/recent-activity";
import type {
  CourseStats,
  OverallStats,
  TopicStat,
} from "@/lib/queries/stats";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Cursurile tale, progres și status abonament.",
  robots: { index: false, follow: false },
};

function emptyCourseStats(slug: CourseSlug): CourseStats {
  return {
    courseSlug: slug,
    totalAttempts: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
    bestScore: 0,
    lastAttemptAt: null,
    topics: [],
    weakest: [],
    strongest: [],
    recentScores: [],
  };
}

function emptyOverallStats(): OverallStats {
  const byCourse = {} as Record<CourseSlug, CourseStats>;
  for (const c of allCoursesMeta) byCourse[c.slug] = emptyCourseStats(c.slug);
  return {
    totalAttempts: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
    byCourse,
    strongest: [],
    weakest: [],
  };
}

export default async function DashboardPage() {
  let firstName = "elev";
  let subscription: SubscriptionRow | null = null;
  let stats: OverallStats = emptyOverallStats();
  const completedBySlug: Record<string, number> = {};

  if (isPreviewMode) {
    firstName = previewProfile.full_name.split(" ")[0] ?? "elev";
    subscription = previewSubscription;
    for (const c of allCoursesMeta) completedBySlug[c.slug] = 0;
  } else {
    const supabase = await createClient();
    const user = await getCurrentUser(supabase);
    if (!user) return null;

    const [profile, sub, overallStats] = await Promise.all([
      getCurrentProfile(supabase),
      getActiveSubscription(supabase).catch(() => null),
      getOverallStats(
        supabase,
        allCoursesMeta.map((c) => c.slug),
      ),
    ]);
    firstName =
      profile?.full_name?.split(" ")[0] ??
      (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
      "elev";
    subscription = sub;
    stats = overallStats;

    await Promise.all(
      allCoursesMeta.map(async (c) => {
        const set = await getCompletedLessonSlugs(supabase, c.slug);
        completedBySlug[c.slug] = set.size;
      }),
    );
  }

  const bestOverall = Math.max(
    0,
    ...allCoursesMeta.map((c) => stats.byCourse[c.slug]?.bestScore ?? 0),
  );

  // Continue-where-you-left-off pick: course with most-recent attempt, or the
  // first course the user has any progress on.
  const continueCourse =
    allCoursesMeta
      .map((c) => ({ c, last: stats.byCourse[c.slug]?.lastAttemptAt ?? "" }))
      .filter((x) => x.last)
      .sort((a, b) => b.last.localeCompare(a.last))[0]?.c ?? allCoursesMeta[0];

  return (
    <>
      <Suspense fallback={null}>
        <PasswordResetToast />
      </Suspense>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8">
        {/* Welcome */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dashboard
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Bun venit înapoi,{" "}
              <span className="text-accent">{firstName}</span>.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.totalAttempts === 0
                ? "Începe cu un examen ca să vezi unde stai pe topic. Practice e fără presiune."
                : `Ai răspuns la ${stats.totalQuestions} întrebări de examen. Aici e harta progresului tău.`}
            </p>
          </div>
          <Link
            href={`/curs/${continueCourse.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <PlayCircle className="size-4" />
            Continuă cu {continueCourse.title.split(" — ")[0]}
            <ArrowRight className="size-3.5" />
          </Link>
        </header>

        <SubscriptionStatusCard subscription={subscription} />

        {/* Big numbers */}
        <StatsHero
          overallAccuracy={stats.overallAccuracy}
          totalQuestions={stats.totalQuestions}
          totalAttempts={stats.totalAttempts}
          bestScore={bestOverall}
        />

        {/* Strengths + Weaknesses */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              Unde te descurci, unde nu
            </h2>
            <p className="text-xs text-muted-foreground">
              top 3 din fiecare, după acuratețe
            </p>
          </div>
          <StrengthsWeaknesses
            strongest={stats.strongest}
            weakest={stats.weakest}
          />
        </section>

        {/* Recent activity */}
        <RecentActivity byCourse={stats.byCourse} />

        {/* Per-course progress + topic accuracy */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              Cursurile tale
            </h2>
            <Link
              href="/progres"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Vezi tot progresul
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {allCoursesMeta.map((c) => {
              const total = getCourseContent(c.slug)?.lessons.length ?? 0;
              const done = completedBySlug[c.slug] ?? 0;
              const percent = total === 0 ? 0 : Math.round((done / total) * 100);
              return (
                <CourseCard
                  key={c.slug}
                  meta={c}
                  completedLessons={done}
                  totalLessons={total}
                  lessonPercent={percent}
                  stats={stats.byCourse[c.slug]}
                />
              );
            })}
          </div>

          {/* Per-course topic accuracy lists, only when the user has data */}
          {allCoursesMeta.some((c) => stats.byCourse[c.slug]?.topics.length) && (
            <div className="grid gap-4 mt-4 lg:grid-cols-2">
              {allCoursesMeta
                .filter((c) => stats.byCourse[c.slug]?.topics.length)
                .map((c) => (
                  <TopicAccuracyList
                    key={c.slug}
                    course={c}
                    stats={stats.byCourse[c.slug]}
                  />
                ))}
            </div>
          )}
        </section>

        {/* Study tips */}
        <section className="rounded-2xl border border-border bg-muted/30 p-5">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Cum să studiezi eficient
              </p>
              <ol className="mt-2 space-y-1 leading-relaxed">
                <li>
                  <span className="text-foreground">1.</span> Citește toate
                  lecțiile capitolului.
                </li>
                <li>
                  <span className="text-foreground">2.</span> Dă{" "}
                  <span className="font-medium text-accent">Practice</span> pe
                  topicele slabe. Click pe orice topic de mai sus să te ducă
                  direct.
                </li>
                <li>
                  <span className="text-foreground">3.</span> Simulează examenul
                  cu{" "}
                  <span className="font-medium text-primary">Examen simulat</span>{" "}
                  — 60 min, 50 întrebări.
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function CourseCard({
  meta,
  completedLessons,
  totalLessons,
  lessonPercent,
  stats,
}: {
  meta: (typeof allCoursesMeta)[number];
  completedLessons: number;
  totalLessons: number;
  lessonPercent: number;
  stats: CourseStats | undefined;
}) {
  const accuracy = stats?.overallAccuracy ?? 0;
  const bestScore = stats?.bestScore ?? 0;
  const attempts = stats?.totalAttempts ?? 0;
  const weakest: TopicStat | undefined = stats?.weakest?.[0];
  const tone =
    bestScore >= meta.passingScore
      ? "success"
      : bestScore > 0
        ? "warning"
        : "muted";

  return (
    <Link
      href={`/curs/${meta.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <CourseIcon slug={meta.slug} src={meta.icon} size={44} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {meta.duration} · {meta.difficulty}
          </p>
          <h3 className="mt-0.5 text-base font-bold tracking-tight">
            {meta.title.split(" — ")[0]}
          </h3>
        </div>
        {bestScore > 0 && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-xs font-bold tabular-nums",
              tone === "success" && "bg-success/15 text-success",
              tone === "warning" && "bg-warning/15 text-warning",
            )}
          >
            {bestScore}%
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Mini
          label="Lecții"
          value={`${completedLessons}/${totalLessons}`}
          percent={lessonPercent}
          color="primary"
        />
        <Mini
          label="Acuratețe"
          value={attempts > 0 ? `${accuracy}%` : "—"}
          percent={attempts > 0 ? accuracy : 0}
          color={
            accuracy >= 80 ? "success" : accuracy >= 60 ? "warning" : "destructive"
          }
        />
      </div>

      {weakest && (
        <p className="mt-4 text-[11px] text-muted-foreground">
          <span className="text-foreground">Punct slab:</span>{" "}
          {weakest.topic} ·{" "}
          <span className="font-mono font-semibold tabular-nums text-warning">
            {weakest.accuracy}%
          </span>
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {attempts === 0
            ? "Niciun examen încă"
            : `${attempts} ${attempts === 1 ? "examen dat" : "examene date"}`}
        </span>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

function Mini({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: string;
  percent: number;
  color: "primary" | "success" | "warning" | "destructive";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "font-mono text-sm font-bold tabular-nums",
            color === "success" && "text-success",
            color === "warning" && "text-warning",
            color === "destructive" && "text-destructive",
            color === "primary" && "text-foreground",
          )}
        >
          {value}
        </span>
      </div>
      <Progress
        value={percent}
        className={cn(
          "mt-1.5 h-1",
          color === "success" && "[&>div]:bg-success",
          color === "warning" && "[&>div]:bg-warning",
          color === "destructive" && "[&>div]:bg-destructive",
        )}
      />
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Target, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries/user";
import { getActiveSubscription } from "@/lib/queries/subscription";
import {
  getCompletedLessonSlugs,
  getExamSummary,
} from "@/lib/queries/progress-slug";
import {
  isPreviewMode,
  previewProfile,
  previewSubscription,
} from "@/lib/preview-mode";
import { allCoursesMeta, getCourseContent } from "@/lib/content/courses";
import type { SubscriptionRow } from "@/lib/queries/subscription";
import { SubscriptionStatusCard } from "@/components/app/subscription-status-card";
import { PasswordResetToast } from "@/components/app/password-reset-toast";
import { Progress } from "@/components/ui/progress";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Cursurile tale, progres și status abonament.",
  robots: { index: false, follow: false },
};

interface CourseProgress {
  completedLessons: number;
  totalLessons: number;
  percent: number;
  bestExamScore: number;
}

export default async function DashboardPage() {
  let firstName = "elev";
  let subscription: SubscriptionRow | null = null;
  const progressBySlug: Record<string, CourseProgress> = {};

  if (isPreviewMode) {
    firstName = previewProfile.full_name.split(" ")[0] ?? "elev";
    subscription = previewSubscription;
    for (const c of allCoursesMeta) {
      const total = getCourseContent(c.slug)?.lessons.length ?? 0;
      progressBySlug[c.slug] = {
        completedLessons: 0,
        totalLessons: total,
        percent: 0,
        bestExamScore: 0,
      };
    }
  } else {
    const supabase = await createClient();
    const user = await getCurrentUser(supabase);
    if (!user) return null;

    const [profile, sub] = await Promise.all([
      getCurrentProfile(supabase),
      getActiveSubscription(supabase).catch(() => null),
    ]);
    firstName =
      profile?.full_name?.split(" ")[0] ??
      (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
      "elev";
    subscription = sub;

    await Promise.all(
      allCoursesMeta.map(async (c) => {
        const content = getCourseContent(c.slug);
        const total = content?.lessons.length ?? 0;
        const [completedSet, exam] = await Promise.all([
          getCompletedLessonSlugs(supabase, c.slug),
          getExamSummary(supabase, c.slug),
        ]);
        progressBySlug[c.slug] = {
          completedLessons: completedSet.size,
          totalLessons: total,
          percent: total === 0 ? 0 : Math.round((completedSet.size / total) * 100),
          bestExamScore: exam.bestScore,
        };
      }),
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <PasswordResetToast />
      </Suspense>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8">
        <header>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Bun venit înapoi,{" "}
            <span className="text-accent">{firstName}</span>.
          </h1>
        </header>

        <SubscriptionStatusCard subscription={subscription} />

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                Cursurile tale
              </h2>
              <p className="text-sm text-muted-foreground">
                Click pe un curs ca să continui de unde ai rămas.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allCoursesMeta.map((c) => {
              const p = progressBySlug[c.slug] ?? {
                completedLessons: 0,
                totalLessons: 0,
                percent: 0,
                bestExamScore: 0,
              };
              return (
                <Link
                  key={c.slug}
                  href={`/curs/${c.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <CourseIcon slug={c.slug} src={c.icon} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {c.duration} · {c.difficulty}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold tracking-tight">
                        {c.title.split(" — ")[0]}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                    {c.blurb}
                  </p>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-muted-foreground">
                        {p.completedLessons}/{p.totalLessons} lecții
                      </span>
                      <span className="font-mono tabular-nums">{p.percent}%</span>
                    </div>
                    <Progress value={p.percent} className="mt-2 h-1.5" />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs">
                    {p.bestExamScore > 0 ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono font-bold tabular-nums",
                          p.bestExamScore >= c.passingScore
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning",
                        )}
                      >
                        <Trophy className="size-3" />
                        Cel mai bun: {p.bestExamScore}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-muted-foreground">
                        <Target className="size-3" />
                        Niciun examen încă
                      </span>
                    )}
                    <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

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
                  <span className="font-medium text-accent">Practice</span> până nu mai greșești.
                </li>
                <li>
                  <span className="text-foreground">3.</span> Simulează
                  examenul cu{" "}
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

import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries/user";
import { getMyCourses } from "@/lib/queries/courses";
import {
  getCourseProgressMap,
  type CourseProgressSummary,
} from "@/lib/queries/progress";
import { getActiveSubscription } from "@/lib/queries/subscription";
import {
  isPreviewMode,
  previewUser,
  previewProfile,
  previewCourses,
  previewProgressMap,
  previewSubscription,
} from "@/lib/preview-mode";
import type { MyCourseRow } from "@/lib/queries/courses";
import type { SubscriptionRow } from "@/lib/queries/subscription";
import { CourseProgressCard } from "@/components/app/course-progress-card";
import { EmptyCoursesState } from "@/components/app/empty-courses-state";
import { SubscriptionStatusCard } from "@/components/app/subscription-status-card";
import { PasswordResetToast } from "@/components/app/password-reset-toast";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Cursurile tale, progres și status abonament.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  let firstName: string;
  let myCourses: MyCourseRow[];
  let subscription: SubscriptionRow | null;
  let progressMap: Record<string, CourseProgressSummary>;

  if (isPreviewMode) {
    firstName = previewProfile.full_name.split(" ")[0] ?? "elev";
    myCourses = previewCourses;
    subscription = previewSubscription;
    progressMap = previewProgressMap;
  } else {
    const supabase = await createClient();
    const user = await getCurrentUser(supabase);
    if (!user) return null;

    const [profile, courses, sub] = await Promise.all([
      getCurrentProfile(supabase),
      getMyCourses(supabase),
      getActiveSubscription(supabase).catch(() => null),
    ]);

    firstName =
      profile?.full_name?.split(" ")[0] ??
      (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
      "elev";
    myCourses = courses;
    subscription = sub;

    const courseIds = courses.map((c) => c.id);
    progressMap = courseIds.length
      ? await getCourseProgressMap(supabase, courseIds).catch(() => ({}))
      : {};
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
                {myCourses.length === 0
                  ? "Aici apar cursurile la care ai acces."
                  : "Click pe un curs ca să continui de unde ai rămas."}
              </p>
            </div>
          </div>

          {myCourses.length === 0 ? (
            <EmptyCoursesState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((c) => {
                const stats = progressMap[c.id];
                return (
                  <CourseProgressCard
                    key={c.id}
                    slug={c.slug}
                    title={c.title}
                    icon={c.icon}
                    estimatedDuration={c.estimated_duration}
                    totalLessons={stats?.totalLessons ?? 0}
                    completedLessons={stats?.completedLessons ?? 0}
                    percent={stats?.percent ?? 0}
                    expiresAt={c.expires_at}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

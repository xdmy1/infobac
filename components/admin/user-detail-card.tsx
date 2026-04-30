import type { AdminUserDetail } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanLabels } from "@/lib/supabase/types";
import { UserActionsMenu } from "@/components/admin/user-actions-menu";
import { GrantCourseControls } from "@/components/admin/grant-course-controls";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ro-MD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ro-MD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function UserDetailCard({ data }: { data: AdminUserDetail }) {
  const { profile, subscriptions, courseAccess, attempts } = data;
  const hasAccess = courseAccess.length > 0;

  const attemptsByCourse = new Map<string, typeof attempts>();
  for (const a of attempts) {
    const key = a.course_slug ?? "—";
    const list = attemptsByCourse.get(key) ?? [];
    list.push(a);
    attemptsByCourse.set(key, list);
  }

  return (
    <div className="mt-6 space-y-8 md:mt-8">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
            {profile.full_name}
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {profile.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {profile.role === "admin" ? (
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 font-mono text-[10px] text-primary"
              >
                admin
              </Badge>
            ) : null}
            {profile.school ? (
              <span className="text-muted-foreground">{profile.school}</span>
            ) : null}
            {profile.grade ? (
              <span className="text-muted-foreground">
                · clasa {profile.grade}
              </span>
            ) : null}
            <span className="text-muted-foreground">
              · înscris {formatDate(profile.created_at)}
            </span>
          </div>
        </div>

        <UserActionsMenu
          userId={profile.id}
          userName={profile.full_name}
          hasAccess={hasAccess}
          hideDetailLink
        />
      </header>

      {/* Subscriptions */}
      <Section title="Abonamente" count={subscriptions.length}>
        {subscriptions.length === 0 ? (
          <Empty text="Niciun abonament." />
        ) : (
          <ul className="space-y-2">
            {subscriptions.map((s) => {
              const tone =
                s.status === "active" || s.status === "trialing"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-muted-foreground/20 bg-muted text-muted-foreground";
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {SubscriptionPlanLabels[s.plan] ?? s.plan}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {formatDate(s.current_period_start)}
                      {" → "}
                      {formatDate(s.current_period_end)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("font-mono text-[10px]", tone)}
                  >
                    {s.status}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* Course access — admin can grant + revoke individual courses here */}
      <Section title="Acces la cursuri" count={courseAccess.length}>
        <GrantCourseControls
          userId={profile.id}
          currentAccess={courseAccess.map((ca) => ({
            id: ca.id,
            courseSlug: ca.course?.slug ?? "—",
            courseTitle: ca.course?.title ?? ca.course_id,
            expiresAt: ca.expires_at,
            source: ca.source,
          }))}
        />
      </Section>

      {/* Quiz attempts */}
      <Section title="Scoruri quiz-uri" count={attempts.length}>
        {attempts.length === 0 ? (
          <Empty text="Niciun quiz dat încă." />
        ) : (
          <div className="space-y-5">
            {Array.from(attemptsByCourse.entries()).map(([slug, list]) => {
              const best = list.reduce<number | null>((max, a) => {
                if (typeof a.score !== "number") return max;
                return max === null || a.score > max ? a.score : max;
              }, null);
              return (
                <div key={slug}>
                  <div className="mb-2 flex items-baseline justify-between border-b border-border/60 pb-1.5">
                    <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      {slug}
                    </h3>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      best {best !== null ? `${best}%` : "—"} · {list.length}{" "}
                      încercări
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {list.slice(0, 8).map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/40"
                      >
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {formatDateTime(a.completed_at)}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {a.mode ?? "—"}
                          </span>
                          <span className="w-12 text-right font-mono font-semibold tabular-nums">
                            {a.score !== null ? `${a.score}%` : "—"}
                          </span>
                        </span>
                      </li>
                    ))}
                    {list.length > 8 ? (
                      <li className="px-2 text-[10px] text-muted-foreground">
                        + încă {list.length - 8} încercări
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-tight md:text-lg">
          {title}
        </h2>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}

import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseStats } from "@/lib/queries/stats";
import type { CourseSlug } from "@/lib/content/courses";

interface Props {
  byCourse: Record<CourseSlug, CourseStats>;
}

const COURSE_LABEL: Record<CourseSlug, string> = {
  python: "Python",
  sql: "SQL",
  devices: "Devices",
};

const COURSE_ACCENT: Record<CourseSlug, string> = {
  python: "bg-primary",
  sql: "bg-accent",
  devices: "bg-warning",
};

/**
 * Compact 7-day timeline of recent exam scores. Each marker is a single
 * attempt; the vertical position encodes the score (higher = better).
 */
export function RecentActivity({ byCourse }: Props) {
  const all: { score: number; date: string; courseSlug: CourseSlug }[] = [];
  for (const slug of Object.keys(byCourse) as CourseSlug[]) {
    for (const r of byCourse[slug].recentScores) {
      all.push({ ...r, courseSlug: slug });
    }
  }
  all.sort((a, b) => a.date.localeCompare(b.date));

  if (all.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <header className="mb-3 flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Activity className="size-4" strokeWidth={2.25} />
          </span>
          <h3 className="text-base font-bold tracking-tight">
            Ultimele 7 zile
          </h3>
        </header>
        <p className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          Niciun examen în ultimele 7 zile. Dă unul azi ca să pornești
          streak-ul.
        </p>
      </section>
    );
  }

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  // Build a per-day bucket for the last 7 days
  const days: { label: string; iso: string; scores: typeof all }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("ro-MD", { weekday: "short" }).slice(0, 2);
    days.push({ label, iso, scores: [] });
  }
  for (const a of all) {
    if (new Date(a.date).getTime() < sevenDaysAgo) continue;
    const iso = a.date.slice(0, 10);
    const day = days.find((d) => d.iso === iso);
    if (day) day.scores.push(a);
  }

  const totalAttempts = all.length;
  const avgScore = Math.round(
    all.reduce((s, a) => s + a.score, 0) / Math.max(1, all.length),
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Activity className="size-4" strokeWidth={2.25} />
          </span>
          <h3 className="text-base font-bold tracking-tight">
            Ultimele 7 zile
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-mono font-bold tabular-nums text-foreground">
            {totalAttempts}
          </span>{" "}
          examene · medie{" "}
          <span className="font-mono font-bold tabular-nums text-foreground">
            {avgScore}%
          </span>
        </p>
      </header>

      {/* Bar chart-ish: 7 columns, score height encoded by max attempt */}
      <div className="flex h-32 items-end gap-1.5">
        {days.map((d) => {
          const max =
            d.scores.length > 0
              ? Math.max(...d.scores.map((s) => s.score))
              : 0;
          return (
            <div
              key={d.iso}
              className="group flex flex-1 flex-col items-center gap-1"
            >
              <div className="relative flex h-full w-full items-end">
                {d.scores.length > 0 ? (
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all",
                      max >= 80
                        ? "bg-success"
                        : max >= 60
                          ? "bg-warning"
                          : "bg-destructive",
                    )}
                    style={{ height: `${Math.max(8, max)}%` }}
                    title={`${d.iso} — ${max}%`}
                  >
                    {d.scores.length > 1 && (
                      <span className="absolute right-1 top-1 inline-flex size-4 items-center justify-center rounded-full bg-foreground/15 font-mono text-[9px] font-bold text-foreground/80">
                        {d.scores.length}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-1 w-full rounded-full bg-muted" />
                )}
              </div>
              <span className="font-mono text-[10px] font-medium uppercase text-muted-foreground">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Per-course chip legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        {(Object.keys(byCourse) as CourseSlug[]).map((slug) => {
          const cs = byCourse[slug];
          const recent = cs.recentScores.length;
          if (recent === 0) return null;
          return (
            <span
              key={slug}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-1"
            >
              <span
                className={cn("size-2 rounded-full", COURSE_ACCENT[slug])}
              />
              {COURSE_LABEL[slug]} · {recent}
            </span>
          );
        })}
      </div>
    </section>
  );
}

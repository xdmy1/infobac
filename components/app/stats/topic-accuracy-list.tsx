import Link from "next/link";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import type { CourseStats } from "@/lib/queries/stats";
import type { CourseMeta } from "@/lib/content/courses";

interface Props {
  course: CourseMeta;
  stats: CourseStats;
}

/**
 * Per-course breakdown: every topic the user has attempted, with a
 * coloured accuracy bar. Sorted by accuracy descending so the wins land
 * on top and the work-needed items at the bottom.
 */
export function TopicAccuracyList({ course, stats }: Props) {
  const hasData = stats.topics.length > 0;
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <CourseIcon slug={course.slug} src={course.icon} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Acuratețe per topic
          </p>
          <h3 className="text-base font-bold tracking-tight">
            {course.title.split(" — ")[0]}
          </h3>
        </div>
        <Link
          href={`/curs/${course.slug}/test`}
          className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        >
          Test
        </Link>
      </header>

      {!hasData ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          Niciun examen încă pe acest curs. Dă unul ca să vezi aici unde stai
          pe fiecare topic.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {stats.topics.map((t) => (
            <li key={t.topic}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium">{t.topic}</p>
                <p className="shrink-0 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                  <span className={tone(t.accuracy)}>{t.accuracy}%</span>
                  <span className="ml-1">
                    · {t.correct}/{t.total}
                  </span>
                </p>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-700 ease-out",
                    barTone(t.accuracy),
                  )}
                  style={{ width: `${Math.max(2, t.accuracy)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function tone(pct: number): string {
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-destructive";
}

function barTone(pct: number): string {
  if (pct >= 80) return "bg-success";
  if (pct >= 60) return "bg-warning";
  return "bg-destructive";
}

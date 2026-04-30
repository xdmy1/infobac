import Link from "next/link";
import { Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import type { TopicStat } from "@/lib/queries/stats";
import type { CourseSlug } from "@/lib/content/courses";
import { cn } from "@/lib/utils";

type WithCourse = TopicStat & { courseSlug: CourseSlug };

interface Props {
  strongest: WithCourse[];
  weakest: WithCourse[];
}

const COURSE_LABELS: Record<CourseSlug, string> = {
  python: "Python",
  sql: "SQL",
  devices: "Devices",
};

export function StrengthsWeaknesses({ strongest, weakest }: Props) {
  if (strongest.length === 0 && weakest.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Dă cel puțin un examen ca să apară punctele tale forte și slabe pe
          topic.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        kind="strong"
        title="Puncte forte"
        emptyHint="Răspunde la mai multe întrebări — apare automat."
        items={strongest}
      />
      <Panel
        kind="weak"
        title="Puncte slabe"
        emptyHint="Continuă să exersezi — orice topic sub 70% apare aici."
        items={weakest}
      />
    </div>
  );
}

function Panel({
  kind,
  title,
  items,
  emptyHint,
}: {
  kind: "strong" | "weak";
  title: string;
  items: WithCourse[];
  emptyHint: string;
}) {
  const isStrong = kind === "strong";
  const Icon = isStrong ? Sparkles : AlertTriangle;
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6",
        isStrong
          ? "border-success/30 bg-success/[0.03]"
          : "border-warning/30 bg-warning/[0.03]",
      )}
    >
      <header className="mb-4 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-xl",
            isStrong
              ? "bg-success/15 text-success"
              : "bg-warning/20 text-warning",
          )}
        >
          <Icon className="size-4" strokeWidth={2.25} />
        </span>
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
      </header>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyHint}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((t, i) => (
            <li key={`${t.courseSlug}-${t.topic}`}>
              <Link
                href={`/curs/${t.courseSlug}/test/practice`}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                  isStrong
                    ? "border-success/20 hover:border-success/40"
                    : "border-warning/20 hover:border-warning/40",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold tabular-nums",
                    isStrong
                      ? "bg-success/15 text-success"
                      : "bg-warning/20 text-warning",
                  )}
                >
                  #{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {t.topic}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-sm font-bold tabular-nums",
                        isStrong ? "text-success" : "text-warning",
                      )}
                    >
                      {t.accuracy}%
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {COURSE_LABELS[t.courseSlug]} · {t.correct}/{t.total} corecte
                  </p>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LessonListItem {
  id: string;
  slug: string;
  title: string;
  duration_minutes: number;
  order_index: number;
  /** Computed: completed > available > locked */
  state: "completed" | "current" | "available" | "locked";
}

interface LessonListProps {
  courseSlug: string;
  lessons: LessonListItem[];
}

export function LessonList({ courseSlug, lessons }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Conținutul lecțiilor va fi adăugat în curând.
        </p>
      </div>
    );
  }

  return (
    <ol className="overflow-hidden rounded-2xl border border-border bg-card">
      {lessons.map((lesson, i) => (
        <LessonRow
          key={lesson.id}
          lesson={lesson}
          courseSlug={courseSlug}
          isLast={i === lessons.length - 1}
        />
      ))}
    </ol>
  );
}

function LessonRow({
  lesson,
  courseSlug,
  isLast,
}: {
  lesson: LessonListItem;
  courseSlug: string;
  isLast: boolean;
}) {
  const isLocked = lesson.state === "locked";
  const isCompleted = lesson.state === "completed";
  const isCurrent = lesson.state === "current";

  const Icon = isCompleted
    ? CheckCircle2
    : isLocked
      ? Lock
      : PlayCircle;

  const iconClasses = isCompleted
    ? "text-success"
    : isLocked
      ? "text-muted-foreground/60"
      : isCurrent
        ? "text-primary"
        : "text-muted-foreground";

  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(lesson.order_index).padStart(2, "0")}
        </span>
        <Icon className={cn("size-5 shrink-0", iconClasses)} strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium md:text-base",
              isLocked ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {lesson.title}
          </p>
          {isCurrent && (
            <p className="text-xs text-primary">Continuă lecția →</p>
          )}
        </div>
      </div>

      <div className="ml-3 flex items-center gap-3">
        <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
          <Clock className="size-3" />
          {lesson.duration_minutes} min
        </span>
        {isLocked ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Premium
          </span>
        ) : null}
      </div>
    </>
  );

  const baseClasses = cn(
    "flex items-center justify-between px-4 py-4 transition-colors md:px-5",
    !isLast && "border-b border-border"
  );

  if (isLocked) {
    return (
      <li className={cn(baseClasses, "opacity-70")} aria-disabled="true">
        {content}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/curs/${courseSlug}/lectia/${lesson.slug}`}
        className={cn(baseClasses, "hover:bg-muted/40")}
      >
        {content}
      </Link>
    </li>
  );
}

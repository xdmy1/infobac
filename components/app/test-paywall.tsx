import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { CourseIcon } from "@/components/shared/course-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseMeta } from "@/lib/content/courses/types";

interface Props {
  course: CourseMeta;
  /** What's blocked — "Practice", "Examen", "Toate testele" etc. */
  whatLocked: string;
}

/**
 * Paywall card shown on /curs/<slug>/test/* when the user lacks active
 * course_access for the course. Mirrors PaywallView from the lesson page.
 */
export function TestPaywall({ course, whatLocked }: Props) {
  return (
    <div className="mx-auto w-full max-w-2xl px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20 lg:px-8">
      <Link
        href={`/curs/${course.slug}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {course.title.split(" — ")[0]}
      </Link>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-center md:p-10">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Lock className="size-6" />
        </span>
        <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {whatLocked} blocat
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight md:text-3xl">
          Activează {course.title.split(" — ")[0]} ca să exersezi
        </h1>
        <p className="mt-3 text-pretty text-sm text-muted-foreground md:text-base">
          Practice și examenele simulate cer abonament. Primele 2 lecții stau
          libere ca să poți încerca cursul înainte.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/abonament/cumpara/module?course=${course.slug}`}
            className={cn(
              buttonVariants(),
              "h-11 gap-2 px-5 text-sm font-semibold",
            )}
          >
            <CourseIcon slug={course.slug} src={course.icon} size={16} />
            Doar {course.title.split(" — ")[0]} · 250 MDL
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/abonament/cumpara/all"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 px-5 text-sm",
            )}
          >
            Toate cursurile · 550 MDL
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import {
  allCourses,
  courseSyllabi,
  type CourseColor,
  type PathwayStep,
  type CourseSyllabus,
} from "@/lib/content";

const colorStyles: Record<
  CourseColor,
  { badge: string; ring: string; weight: string; bullet: string }
> = {
  primary: {
    badge: "bg-primary/10 text-primary border-primary/20",
    ring: "ring-primary/20",
    weight: "text-primary",
    bullet: "text-primary",
  },
  accent: {
    badge: "bg-accent/20 text-foreground border-accent/30",
    ring: "ring-accent/30",
    weight: "text-foreground",
    bullet: "text-accent-hover",
  },
  warning: {
    badge: "bg-warning/15 text-foreground border-warning/30",
    ring: "ring-warning/20",
    weight: "text-foreground",
    bullet: "text-warning",
  },
  success: {
    badge: "bg-success/15 text-foreground border-success/30",
    ring: "ring-success/20",
    weight: "text-foreground",
    bullet: "text-success",
  },
};

export function CoursesDetail() {
  return (
    <>
      {allCourses.map((step, index) => (
        <CourseDetailSection
          key={step.slug}
          step={step}
          syllabus={courseSyllabi[step.slug]}
          index={index}
        />
      ))}
    </>
  );
}

function CourseDetailSection({
  step,
  syllabus,
  index,
}: {
  step: PathwayStep;
  syllabus: CourseSyllabus;
  index: number;
}) {
  const styles = colorStyles[step.color];
  const isAlt = index % 2 === 1;

  return (
    <section
      id={step.slug}
      className={cn(
        "scroll-mt-20 border-t border-border py-20 md:py-28 lg:py-32",
        isAlt && "bg-muted/20"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums",
                  styles.badge.replace("/10", "/15").replace("/15", "/20")
                )}
              >
                {index + 1}
              </span>
              <Badge variant="outline" className={cn("font-mono", styles.badge)}>
                Examen {step.examLetter} · {step.tag}
              </Badge>
            </div>

            <div className="space-y-3">
              <CourseIcon slug={step.slug} size={84} alt="" />
              <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                {step.title}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                {step.certName}
              </p>
            </div>

            <p className="text-pretty text-base text-muted-foreground md:text-lg">
              {syllabus.intro}
            </p>

            <dl className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <dt className="sr-only">Durată estimată</dt>
                <dd>
                  <span className="font-medium text-foreground">{step.duration}</span>{" "}
                  <span className="text-muted-foreground">de pregătire</span>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <dt className="sr-only">Format examen</dt>
                <dd className="text-muted-foreground">{syllabus.examFormat}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/inregistrare?from=cursuri&plan=standard`}
                className={cn(
                  buttonVariants(),
                  "h-11 gap-1.5 px-5 text-sm font-medium"
                )}
              >
                Înscrie-te la {step.title}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#preturi"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-11 px-5 text-sm font-medium"
                )}
              >
                Vezi prețurile
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              className={cn(
                "rounded-2xl border border-border bg-card p-6 ring-1 md:p-8",
                styles.ring
              )}
            >
              <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Programa
              </h3>

              <ol className="space-y-6">
                {syllabus.topics.map((topic, i) => (
                  <li key={i} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <h4 className="text-base font-semibold text-foreground md:text-lg">
                        <span className="mr-2 font-mono text-xs font-medium text-muted-foreground tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {topic.title}
                      </h4>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-xs font-bold tabular-nums",
                          styles.weight
                        )}
                      >
                        {topic.weight}
                      </span>
                    </div>
                    <ul className="ml-7 space-y-1.5">
                      {topic.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "mt-2 size-1 shrink-0 rounded-full",
                              styles.bullet
                            )}
                            style={{ backgroundColor: "currentColor" }}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

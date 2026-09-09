"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import { startTrialAction } from "@/lib/actions/trial";
import { allCoursesMeta, type CourseSlug } from "@/lib/content/courses";
import { freeTrial } from "@/lib/content";
import { track } from "@/lib/analytics/events";

/**
 * Pick one module, press one button, get seven days.
 *
 * There is deliberately no card field, no "we won't charge you yet" small
 * print and no saved payment method — the reassurance is that the form has
 * nothing to reassure you about.
 */
export function TrialClaim() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [courseSlug, setCourseSlug] = useState<CourseSlug | "">("");

  const handleStart = () => {
    if (!courseSlug) {
      toast.error("Alege un modul întâi.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await startTrialAction({ courseSlug });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        track("trial_started", { course: courseSlug });
        toast.success(`Ai ${freeTrial.days} zile de acces. Începe acum.`);
        router.push(result.redirectTo);
        router.refresh();
      } catch (err) {
        console.warn("[trial] start failed:", err);
        toast.error("Nu am putut porni perioada de probă. Reîncearcă.");
      }
    });
  };

  return (
    <div className="space-y-5">
      <fieldset className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <legend className="px-2 text-sm font-bold">Alege modulul tău</legend>
        <p className="mb-3 text-xs text-muted-foreground">
          Primești acces complet la modulul ales: toate lecțiile, quiz-urile și
          simulările de examen.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {allCoursesMeta.map((c) => {
            const selected = courseSlug === c.slug;
            return (
              <label
                key={c.slug}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background",
                )}
              >
                <input
                  type="radio"
                  name="trial-course"
                  value={c.slug}
                  checked={selected}
                  onChange={() => setCourseSlug(c.slug)}
                  className="sr-only"
                />
                <CourseIcon slug={c.slug} src={c.icon} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {c.title.split(" — ")[0]}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.duration}
                  </p>
                </div>
                {selected && (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={handleStart}
        disabled={isPending}
        className={cn(
          buttonVariants(),
          "h-12 w-full gap-2 text-sm font-semibold",
          isPending && "cursor-wait",
        )}
      >
        <Sparkles className="size-4" />
        {isPending
          ? "Se activează…"
          : `Începe cele ${freeTrial.days} zile gratis`}
      </button>

      <p className="flex items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        <CreditCard className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
        <span>
          Nu se cere card acum și nu se cere card la final. După{" "}
          {freeTrial.days} zile accesul se oprește singur, fără nicio plată.
        </span>
      </p>
    </div>
  );
}

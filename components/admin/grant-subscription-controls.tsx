"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import { grantSubscriptionAction } from "@/lib/actions/admin";
import { allCoursesMeta } from "@/lib/content/courses";
import {
  SubscriptionPlanLabels,
  type SubscriptionPlan,
} from "@/lib/supabase/types";

type CourseSlug = "python" | "sql" | "devices";

interface Props {
  userId: string;
}

const PLANS: {
  value: SubscriptionPlan;
  label: string;
  description: string;
}[] = [
  { value: "module", label: "Un modul", description: "30 zile · 1 curs ales" },
  { value: "all", label: "Toate modulele", description: "30 zile · 3 cursuri" },
  { value: "semester", label: "6 luni", description: "180 zile · 3 cursuri" },
];

export function GrantSubscriptionControls({ userId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>("all");
  const [courseSlug, setCourseSlug] = useState<CourseSlug>("python");

  const handleGrant = () => {
    startTransition(async () => {
      const result = await grantSubscriptionAction({
        userId,
        plan,
        courseSlug: plan === "module" ? courseSlug : null,
      });
      if (result.ok) {
        toast.success(
          `Abonament acordat: ${SubscriptionPlanLabels[plan]}.`,
        );
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-full gap-1.5 border-dashed text-xs font-semibold sm:w-auto",
        )}
      >
        <Sparkles className="size-3.5" />
        Acordă un abonament
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold">Acordă un abonament</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Plan picker */}
      <div className="mb-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Plan
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {PLANS.map((p) => {
            const selected = plan === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPlan(p.value)}
                className={cn(
                  "rounded-lg border p-2.5 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-foreground/30",
                )}
              >
                <p className="text-xs font-semibold">{p.label}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course picker — only for plan = module */}
      {plan === "module" ? (
        <div className="mb-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Curs
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {allCoursesMeta.map((c) => {
              const selected = courseSlug === c.slug;
              return (
                <label
                  key={c.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-colors",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-foreground/30",
                  )}
                >
                  <input
                    type="radio"
                    name="grantSubCourse"
                    checked={selected}
                    onChange={() => setCourseSlug(c.slug as CourseSlug)}
                    className="sr-only"
                  />
                  <CourseIcon slug={c.slug} src={c.icon} size={24} />
                  <p className="truncate text-xs font-semibold">
                    {c.title.split(" — ")[0]}
                  </p>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleGrant}
        disabled={isPending}
        className={cn(
          buttonVariants(),
          "h-10 w-full gap-1.5 text-sm font-semibold",
          isPending && "cursor-wait",
        )}
      >
        <Plus className="size-3.5" />
        {isPending ? "Se acordă…" : "Acordă abonament"}
      </button>
    </div>
  );
}

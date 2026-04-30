"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, CircleCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markLessonCompleteAction } from "@/lib/actions/lesson";

interface LessonActionsProps {
  courseSlug: string;
  lessonSlug: string;
  alreadyCompleted: boolean;
  prevHref: string | null;
  nextHref: string | null;
}

export function LessonActions({
  courseSlug,
  lessonSlug,
  alreadyCompleted,
  prevHref,
  nextHref,
}: LessonActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(alreadyCompleted);

  const onComplete = () => {
    startTransition(async () => {
      const result = await markLessonCompleteAction(courseSlug, lessonSlug);
      if (result.ok) {
        setCompleted(true);
        toast.success(
          result.mode === "preview"
            ? "Marcată ca terminată (preview — nu se salvează)."
            : "Lecție terminată. Mergem mai departe!"
        );
        // If a next lesson exists, push to it after a tiny pause.
        if (nextHref) {
          setTimeout(() => router.push(nextHref), 600);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      {prevHref ? (
        <Link
          href={prevHref}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 gap-1.5 px-3 text-sm"
          )}
        >
          <ArrowLeft className="size-4" />
          Lecția anterioară
        </Link>
      ) : (
        <span />
      )}

      <button
        type="button"
        onClick={onComplete}
        disabled={isPending || completed}
        className={cn(
          buttonVariants({ variant: completed ? "outline" : "default" }),
          "h-10 gap-2 px-5 text-sm font-medium",
          completed && "border-success/40 text-success hover:bg-success/5",
          isPending && "cursor-wait"
        )}
      >
        {completed ? (
          <>
            <CircleCheck className="size-4" />
            Terminată
          </>
        ) : (
          <>
            <Check className="size-4" />
            {isPending ? "Salvăm..." : "Marchează ca terminată"}
          </>
        )}
      </button>

      {nextHref ? (
        <Link
          href={nextHref}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 gap-1.5 px-3 text-sm"
          )}
        >
          Lecția următoare
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

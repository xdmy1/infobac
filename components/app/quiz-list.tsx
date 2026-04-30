import Link from "next/link";
import { Target, Trophy, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];

interface QuizListProps {
  quizzes: QuizRow[];
}

export function QuizList({ quizzes }: QuizListProps) {
  if (quizzes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Quiz-urile pentru acest curs vor fi adăugate în curând.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {quizzes.map((quiz) => {
        const isExam = quiz.type === "exam_simulation";
        const Icon = isExam ? Trophy : Target;
        return (
          <li key={quiz.id}>
            <Link
              href={`/quiz/${quiz.id}`}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md md:p-5",
                isExam ? "border-accent/40" : "border-border"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
                  isExam
                    ? "bg-accent/20 text-accent-foreground"
                    : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold md:text-base">
                  {quiz.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium uppercase tracking-wider text-[10px]">
                    {isExam ? "Examen" : "Practice"}
                  </span>
                  {quiz.time_limit_minutes && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {quiz.time_limit_minutes} min
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

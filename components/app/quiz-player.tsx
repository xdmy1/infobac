"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Send,
  RotateCw,
  Trophy,
  Clock,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CountUp } from "@/components/shared/count-up";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import {
  submitQuizAttemptAction,
  type QuizSubmitResult,
} from "@/lib/actions/quiz";
import type { Database, QuizOption } from "@/lib/supabase/types";

type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];
type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];

interface QuizPlayerProps {
  quiz: QuizRow;
  questions: QuestionRow[];
  courseSlug: string;
  courseTitle: string;
  courseIcon: string;
}

export function QuizPlayer({
  quiz,
  questions,
  courseSlug,
  courseTitle,
  courseIcon,
}: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => Boolean(answers[q.id])).length,
    [answers, questions]
  );

  const allAnswered = answeredCount === questions.length && questions.length > 0;

  const onSelect = (questionId: string, optionId: string) => {
    if (result) return; // lock after submission
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const onSubmit = () => {
    if (!allAnswered) {
      toast.error(
        `Răspunde la toate întrebările (${questions.length - answeredCount} rămase).`
      );
      return;
    }

    // Local scoring used as a hint to the server action (server re-validates).
    let correctCount = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correct_option_id) correctCount += 1;
    }

    startTransition(async () => {
      const res = await submitQuizAttemptAction({
        quizId: quiz.id,
        answers,
        totalQuestions: questions.length,
        correctCount,
      });

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      setResult(res);
      if (res.passed) {
        toast.success(`Ai trecut cu ${res.score}%! 🎯`);
      } else {
        toast.message(
          `${res.score}% — sub pragul de promovare. Recapitulează și încearcă din nou.`
        );
      }
    });
  };

  const onRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nu există întrebări încă pentru acest quiz. Vor fi adăugate în
          curând.
        </p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: -16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <ResultCard result={result} onRetry={onRetry} />
          </motion.div>
        ) : (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mb-6 rounded-2xl border border-border bg-card p-5 md:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.span
                  whileHover={{ rotate: 4, scale: 1.05 }}
                  transition={{ type: "spring", damping: 15, stiffness: 220 }}
                  className="inline-flex shrink-0"
                >
                  <CourseIcon
                    slug={courseSlug}
                    src={courseIcon}
                    size={28}
                    alt=""
                  />
                </motion.span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {courseTitle}
                  </p>
                  <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                    {quiz.title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium uppercase tracking-wider">
                  {quiz.type === "exam_simulation" ? "Examen" : "Practice"}
                </span>
                {quiz.time_limit_minutes && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {quiz.time_limit_minutes} min
                  </span>
                )}
                <span className="font-mono tabular-nums">
                  {answeredCount}/{questions.length}
                </span>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{
                  width: `${(answeredCount / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ol className="space-y-6">
        {questions.map((q, i) => (
          <motion.li
            key={q.id}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <QuestionItem
              question={q}
              index={i}
              selectedOptionId={answers[q.id]}
              revealed={!!result}
              onSelect={onSelect}
            />
          </motion.li>
        ))}
      </ol>

      {!result && (
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/curs/${courseSlug}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 px-4 text-sm"
            )}
          >
            ← Înapoi la curs
          </Link>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending || !allAnswered}
            className={cn(
              buttonVariants(),
              "h-11 gap-2 px-5 text-sm font-medium",
              isPending && "cursor-wait"
            )}
          >
            <Send className="size-4" />
            {isPending ? "Verificăm..." : "Trimite răspunsurile"}
          </button>
        </div>
      )}
    </>
  );
}

function QuestionItem({
  question,
  index,
  selectedOptionId,
  revealed,
  onSelect,
}: {
  question: QuestionRow;
  index: number;
  selectedOptionId?: string;
  revealed: boolean;
  onSelect: (questionId: string, optionId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="flex-1 text-base font-semibold leading-snug md:text-lg">
          {question.question_text}
        </h3>
      </div>

      <ul className="space-y-2">
        {(question.options as QuizOption[]).map((opt) => (
          <OptionRow
            key={opt.id}
            questionId={question.id}
            option={opt}
            selected={selectedOptionId === opt.id}
            revealed={revealed}
            isCorrect={opt.id === question.correct_option_id}
            onSelect={onSelect}
          />
        ))}
      </ul>

      {revealed && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 overflow-hidden rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground"
        >
          <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-foreground">
            Explicație
          </span>
          <p className="text-pretty">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}

function OptionRow({
  questionId,
  option,
  selected,
  revealed,
  isCorrect,
  onSelect,
}: {
  questionId: string;
  option: QuizOption;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  onSelect: (questionId: string, optionId: string) => void;
}) {
  let visual: "neutral" | "selected" | "correct" | "incorrect" = "neutral";

  if (revealed) {
    if (isCorrect) visual = "correct";
    else if (selected && !isCorrect) visual = "incorrect";
  } else if (selected) {
    visual = "selected";
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(questionId, option.id)}
        disabled={revealed}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
          visual === "neutral" &&
            "border-border bg-background hover:border-foreground/20 hover:bg-muted/50",
          visual === "selected" &&
            "border-primary bg-primary/5 text-foreground",
          visual === "correct" &&
            "border-success/50 bg-success/5 text-foreground",
          visual === "incorrect" &&
            "border-destructive/50 bg-destructive/5 text-foreground",
          revealed && "cursor-default"
        )}
      >
        <span
          className={cn(
            "inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold uppercase",
            visual === "neutral" && "border-border text-muted-foreground",
            visual === "selected" &&
              "border-primary bg-primary text-primary-foreground",
            visual === "correct" &&
              "border-success bg-success text-white",
            visual === "incorrect" &&
              "border-destructive bg-destructive text-white"
          )}
          aria-hidden
        >
          {option.id}
        </span>
        <span className="flex-1">{option.text}</span>
        {revealed && isCorrect && (
          <CheckCircle2 className="size-4 shrink-0 text-success" />
        )}
        {revealed && selected && !isCorrect && (
          <XCircle className="size-4 shrink-0 text-destructive" />
        )}
      </button>
    </li>
  );
}

function ResultCard({
  result,
  onRetry,
}: {
  result: QuizSubmitResult;
  onRetry: () => void;
}) {
  if (!result.ok) return null;

  const passed = result.passed;

  return (
    <div
      className={cn(
        "relative mb-6 overflow-hidden rounded-2xl border p-6 shadow-2xl md:p-8",
        passed
          ? "border-success/40 bg-success/5 shadow-success/10"
          : "border-warning/40 bg-warning/5 shadow-warning/10"
      )}
    >
      {passed && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -inset-y-16 -z-0 bg-gradient-to-br from-success/30 via-success/10 to-transparent blur-3xl"
        />
      )}
      <div className="relative flex items-start gap-4">
        <motion.span
          initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 180,
            delay: 0.2,
          }}
          className={cn(
            "inline-flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-lg",
            passed
              ? "bg-success/20 text-success shadow-success/20"
              : "bg-warning/20 text-warning shadow-warning/20"
          )}
        >
          {passed ? (
            <Trophy className="size-7" />
          ) : (
            <RotateCw className="size-6" />
          )}
        </motion.span>
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            {passed ? "Ai trecut!" : "Aproape, dar nu de data asta."}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-muted-foreground md:text-base"
          >
            Scor:{" "}
            <span className="font-mono font-bold tabular-nums text-foreground">
              <CountUp to={result.score} />%
            </span>{" "}
            ({result.correctCount}/{result.totalQuestions} corect)
            {result.mode === "preview" && (
              <span className="ml-2 text-xs italic">
                · preview, nu se salvează
              </span>
            )}
          </motion.p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 gap-2 px-4 text-sm"
          )}
        >
          <RotateCw className="size-4" />
          Reîncearcă
        </button>
      </div>
    </div>
  );
}

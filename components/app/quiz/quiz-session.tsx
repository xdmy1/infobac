"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  Filter,
  RotateCw,
  Trophy,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/content/courses/types";
import {
  emptyAnswerFor,
  isCorrect,
  isFullyAnswered,
  type AnswerMap,
  type QuizMode,
} from "./quiz-types";
import { QuestionCard } from "./question-card";
import { submitExamAttemptAction } from "@/lib/actions/quiz-attempt";

interface QuizSessionProps {
  mode: QuizMode;
  courseSlug: string;
  courseTitle: string;
  questions: Question[];
  /** Total seconds for exam mode. */
  examDurationSeconds?: number;
  /** Pass threshold for exam mode (0-100). */
  passingScore: number;
}

function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function QuizSession({
  mode,
  courseSlug,
  courseTitle,
  questions: rawQuestions,
  examDurationSeconds,
  passingScore,
}: QuizSessionProps) {
  const router = useRouter();

  // Shuffle once per mount.
  const questions = useMemo(() => shuffle(rawQuestions), [rawQuestions]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    const m: AnswerMap = {};
    for (const q of questions) m[q.id] = emptyAnswerFor(q);
    return m;
  });
  /** Practice mode only — which questions have been committed/revealed. */
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [topicFilter, setTopicFilter] = useState<string>("all");

  // Filter applies only to practice mode.
  const filteredIndices = useMemo(() => {
    if (mode !== "practice" || topicFilter === "all") {
      return questions.map((_, i) => i);
    }
    return questions
      .map((q, i) => ({ q, i }))
      .filter((x) => x.q.topic === topicFilter)
      .map((x) => x.i);
  }, [mode, topicFilter, questions]);

  const localIndex = filteredIndices.indexOf(index);
  const currentQ = questions[index];
  const currentA = answers[currentQ.id];
  const currentRevealed = !!revealed[currentQ.id];

  // ── Exam timer ───────────────────────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState(examDurationSeconds ?? 0);
  const [submitted, setSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    correctCount: number;
    total: number;
    passed: boolean;
  } | null>(null);
  const submittedRef = useRef(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (mode !== "exam" || !examDurationSeconds || submitted) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, mode, submitted]);

  // ── Practice mode: auto-commit on full answer for single + yesno; multi
  // requires explicit "Verifică" press because user toggles options.
  function commitCurrent() {
    if (mode !== "practice") return;
    if (!isFullyAnswered(currentQ, currentA)) return;
    setRevealed((r) => ({ ...r, [currentQ.id]: true }));
  }

  function pickSingle(idx: number) {
    if (currentRevealed) return;
    setAnswers((a) => ({
      ...a,
      [currentQ.id]: { type: "single", index: idx },
    }));
    if (mode === "practice") {
      setTimeout(() => {
        setRevealed((r) => ({ ...r, [currentQ.id]: true }));
      }, 50);
    }
  }

  function toggleMulti(idx: number) {
    if (currentRevealed) return;
    setAnswers((a) => {
      const cur = a[currentQ.id];
      if (cur.type !== "multi") return a;
      const exists = cur.indices.includes(idx);
      const next = exists
        ? cur.indices.filter((i) => i !== idx)
        : [...cur.indices, idx];
      return { ...a, [currentQ.id]: { type: "multi", indices: next } };
    });
  }

  function pickStatement(stmtIdx: number, value: boolean) {
    if (currentRevealed) return;
    setAnswers((a) => {
      const cur = a[currentQ.id];
      if (cur.type !== "yesno") return a;
      const next = [...cur.values];
      next[stmtIdx] = value;
      const updated = { ...a, [currentQ.id]: { type: "yesno" as const, values: next } };

      // Auto-reveal in practice mode once every statement is answered.
      if (mode === "practice" && next.every((v) => v !== null)) {
        setTimeout(() => {
          setRevealed((r) => ({ ...r, [currentQ.id]: true }));
        }, 50);
      }
      return updated;
    });
  }

  function goPrev() {
    const li = filteredIndices.indexOf(index);
    if (li > 0) setIndex(filteredIndices[li - 1]);
  }
  function goNext() {
    const li = filteredIndices.indexOf(index);
    if (li < filteredIndices.length - 1) setIndex(filteredIndices[li + 1]);
  }

  // ── Submit (exam mode) ───────────────────────────────────────────────────
  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;

    let correctCount = 0;
    const perQuestion: {
      qid: string;
      topic: string;
      qtype: "single" | "multi" | "yesno";
      correct: boolean;
    }[] = [];
    for (const q of questions) {
      const ok = isCorrect(q, answers[q.id]);
      if (ok) correctCount++;
      perQuestion.push({
        qid: q.id,
        topic: q.topic,
        qtype: q.type,
        correct: ok,
      });
    }
    const total = questions.length;
    const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    const passed = score >= passingScore;

    setExamResult({ score, correctCount, total, passed });
    setSubmitted(true);

    startTransition(async () => {
      await submitExamAttemptAction({
        courseSlug,
        mode: "exam",
        score,
        correctCount,
        totalQuestions: total,
        perQuestion,
      }).catch(() => {
        // server action best-effort; don't break the result UI
      });
    });

    if (passed) {
      toast.success(`Ai trecut cu ${score}%!`);
    } else {
      toast.message(`Scor: ${score}% — sub pragul de ${passingScore}%.`);
    }
  }

  function restart() {
    setIndex(0);
    const m: AnswerMap = {};
    for (const q of questions) m[q.id] = emptyAnswerFor(q);
    setAnswers(m);
    setRevealed({});
    setSubmitted(false);
    submittedRef.current = false;
    setExamResult(null);
    setSecondsLeft(examDurationSeconds ?? 0);
  }

  // ── EXAM RESULT VIEW ─────────────────────────────────────────────────────
  if (mode === "exam" && submitted && examResult) {
    return (
      <ExamResultView
        result={examResult}
        questions={questions}
        answers={answers}
        passingScore={passingScore}
        courseSlug={courseSlug}
        onRetry={restart}
      />
    );
  }

  const topics = Array.from(new Set(questions.map((q) => q.topic)));
  const answeredTotal = questions.filter((q) =>
    isFullyAnswered(q, answers[q.id]),
  ).length;
  const correctSoFar =
    mode === "practice"
      ? questions.filter(
          (q) => revealed[q.id] && isCorrect(q, answers[q.id]),
        ).length
      : 0;

  // ── ACTIVE SESSION VIEW ──────────────────────────────────────────────────
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 md:py-8 lg:px-6">
      <SessionHeader
        mode={mode}
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        questionIndex={localIndex}
        questionTotal={filteredIndices.length}
        answeredTotal={answeredTotal}
        totalQuestions={questions.length}
        secondsLeft={secondsLeft}
        showTimer={mode === "exam" && !!examDurationSeconds}
        topicFilter={topicFilter}
        onTopicFilterChange={(v) => {
          setTopicFilter(v);
          // jump to first question of the filtered set
          const idxs =
            v === "all"
              ? questions.map((_, i) => i)
              : questions
                  .map((q, i) => ({ q, i }))
                  .filter((x) => x.q.topic === v)
                  .map((x) => x.i);
          if (idxs.length) setIndex(idxs[0]);
        }}
        topics={topics}
        correctSoFar={correctSoFar}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <QuestionCard
            question={currentQ}
            index={localIndex}
            total={filteredIndices.length}
            answer={currentA}
            revealed={mode === "exam" ? false : currentRevealed}
            onPickSingle={pickSingle}
            onToggleMulti={toggleMulti}
            onPickStatement={pickStatement}
          />
        </motion.div>
      </AnimatePresence>

      <ActionBar
        mode={mode}
        canPrev={localIndex > 0}
        canNext={localIndex < filteredIndices.length - 1}
        isLastQuestion={localIndex === filteredIndices.length - 1}
        revealed={currentRevealed}
        currentQ={currentQ}
        currentA={currentA}
        onPrev={goPrev}
        onNext={goNext}
        onCommit={commitCurrent}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}

function SessionHeader({
  mode,
  courseTitle,
  courseSlug,
  questionIndex,
  questionTotal,
  answeredTotal,
  totalQuestions,
  secondsLeft,
  showTimer,
  topicFilter,
  onTopicFilterChange,
  topics,
  correctSoFar,
}: {
  mode: QuizMode;
  courseTitle: string;
  courseSlug: string;
  questionIndex: number;
  questionTotal: number;
  answeredTotal: number;
  totalQuestions: number;
  secondsLeft: number;
  showTimer: boolean;
  topicFilter: string;
  onTopicFilterChange: (v: string) => void;
  topics: string[];
  correctSoFar: number;
}) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const lowTime = secondsLeft <= 60;

  return (
    <header className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/curs/${courseSlug}/test`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 gap-1.5 px-2.5 text-xs",
            )}
          >
            <ArrowLeft className="size-3.5" />
            Mod
          </Link>
          <div className="leading-tight">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {mode === "practice" ? "Practice" : "Examen"}
            </p>
            <p className="text-sm font-semibold">{courseTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {mode === "practice" && (
            <span className="rounded-full bg-success/10 px-2.5 py-1 font-mono font-bold tabular-nums text-success">
              ✓ {correctSoFar}
            </span>
          )}
          <span className="rounded-full bg-muted px-2.5 py-1 font-mono font-semibold tabular-nums">
            {String(questionIndex + 1).padStart(2, "0")} / {String(questionTotal).padStart(2, "0")}
          </span>
          {showTimer && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono font-bold tabular-nums",
                lowTime
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-muted",
              )}
            >
              <Clock className="size-3" />
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={false}
            animate={{
              width: `${((questionIndex + 1) / Math.max(1, questionTotal)) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {answeredTotal} răspunse / {totalQuestions}
        </span>
      </div>

      {mode === "practice" && topics.length > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="size-3.5 shrink-0 text-muted-foreground" />
          <button
            type="button"
            onClick={() => onTopicFilterChange("all")}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
              topicFilter === "all"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            Toate
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTopicFilterChange(t)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                topicFilter === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function ActionBar({
  mode,
  canPrev,
  canNext,
  isLastQuestion,
  revealed,
  currentQ,
  currentA,
  onPrev,
  onNext,
  onCommit,
  onSubmit,
  isSubmitting,
}: {
  mode: QuizMode;
  canPrev: boolean;
  canNext: boolean;
  isLastQuestion: boolean;
  revealed: boolean;
  currentQ: Question;
  currentA: import("./quiz-types").AnswerValue;
  onPrev: () => void;
  onNext: () => void;
  onCommit: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  // Practice: multi questions need a "Verifică" button (single + yesno auto-reveal).
  const showCheck =
    mode === "practice" &&
    currentQ.type === "multi" &&
    !revealed &&
    isFullyAnswered(currentQ, currentA);

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 gap-1.5 px-3 text-sm",
          !canPrev && "opacity-40",
        )}
      >
        <ArrowLeft className="size-4" />
        Înapoi
      </button>

      {showCheck && (
        <button
          type="button"
          onClick={onCommit}
          className={cn(
            buttonVariants(),
            "h-11 gap-1.5 px-5 text-sm font-semibold",
          )}
        >
          <CheckCircle2 className="size-4" />
          Verifică
        </button>
      )}

      {mode === "exam" && isLastQuestion ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={cn(
            buttonVariants(),
            "h-11 gap-1.5 px-5 text-sm font-semibold",
            isSubmitting && "cursor-wait",
          )}
        >
          <Send className="size-4" />
          {isSubmitting ? "Se trimite..." : "Trimite"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={cn(
            buttonVariants(
              mode === "practice" && revealed
                ? { variant: "default" }
                : { variant: "outline" },
            ),
            "h-10 gap-1.5 px-3.5 text-sm",
            !canNext && "opacity-40",
          )}
        >
          Următoarea
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}

function ExamResultView({
  result,
  questions,
  answers,
  passingScore,
  courseSlug,
  onRetry,
}: {
  result: { score: number; correctCount: number; total: number; passed: boolean };
  questions: Question[];
  answers: AnswerMap;
  passingScore: number;
  courseSlug: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-10 lg:px-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-6 shadow-2xl md:p-8",
          result.passed
            ? "border-success/40 bg-success/5 shadow-success/10"
            : "border-warning/40 bg-warning/5 shadow-warning/10",
        )}
      >
        <div className="relative flex items-start gap-4">
          <span
            className={cn(
              "inline-flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-lg",
              result.passed
                ? "bg-success/20 text-success shadow-success/20"
                : "bg-warning/20 text-warning shadow-warning/20",
            )}
          >
            {result.passed ? (
              <Trophy className="size-7" />
            ) : (
              <RotateCw className="size-6" />
            )}
          </span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {result.passed ? "Ai trecut!" : "Nu de data asta."}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              <span className="font-mono font-bold tabular-nums text-foreground">
                {result.score}%
              </span>{" "}
              ({result.correctCount}/{result.total} corecte) · pragul ={" "}
              {passingScore}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight md:text-xl">
          Răspunsurile tale
        </h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/curs/${courseSlug}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 gap-1.5 px-3 text-sm",
            )}
          >
            La curs
          </Link>
          <button
            type="button"
            onClick={onRetry}
            className={cn(buttonVariants(), "h-9 gap-1.5 px-3.5 text-sm")}
          >
            <RotateCw className="size-3.5" />
            Reîncearcă
          </button>
        </div>
      </div>

      <ol className="mt-4 space-y-4">
        {questions.map((q, i) => {
          const ok = isCorrect(q, answers[q.id]);
          return (
            <li key={q.id}>
              <div
                className={cn(
                  "rounded-xl border p-4",
                  ok ? "border-success/30" : "border-destructive/30 bg-destructive/[0.02]",
                )}
              >
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-mono font-bold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-medium text-muted-foreground">
                    {q.topic}
                  </span>
                  {ok ? (
                    <span className="ml-auto inline-flex items-center gap-1 text-success">
                      <CheckCircle2 className="size-3.5" />
                      <span className="font-semibold">Corect</span>
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center gap-1 text-destructive">
                      <XCircle className="size-3.5" />
                      <span className="font-semibold">Greșit</span>
                    </span>
                  )}
                </div>
                <QuestionCard
                  question={q}
                  index={i}
                  total={questions.length}
                  answer={answers[q.id]}
                  revealed={true}
                  onPickSingle={() => {}}
                  onToggleMulti={() => {}}
                  onPickStatement={() => {}}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

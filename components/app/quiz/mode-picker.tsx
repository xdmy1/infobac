"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Trophy,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ListChecks,
} from "lucide-react";
import { CourseIcon } from "@/components/shared/course-icon";
import type { CourseMeta } from "@/lib/content/courses/types";
import type { ExamSet } from "@/lib/content/courses/exam-sets";

interface ModePickerProps {
  course: CourseMeta;
  totalQuestions: number;
  examSets: { number: number; label: string; questionCount: number; durationMin: number }[];
  /** Optional best scores per exam number, for the badge on each card. */
  bestScoreByExam?: Record<number, number>;
}

export function ModePicker({
  course,
  totalQuestions,
  examSets,
  bestScoreByExam,
}: ModePickerProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14 lg:px-6">
      <header className="mb-10 flex flex-col items-center text-center md:mb-12">
        <CourseIcon slug={course.slug} src={course.icon} size={56} />
        <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Test • {course.title.split(" — ")[0]}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Cum vrei să exersezi
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {totalQuestions} întrebări totale, împărțite în {examSets.length}{" "}
          examene scurte. Practice e separat — fără timp, cu explicații.
        </p>
      </header>

      {/* Practice — single big card */}
      <div className="mb-10">
        <Link
          href={`/curs/${course.slug}/test/practice`}
          className="group flex flex-col gap-5 rounded-2xl border border-accent/30 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10 md:flex-row md:items-center md:gap-8 md:p-7"
        >
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent md:size-14">
            <Target className="size-6" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                Practice
              </h3>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                Învață
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Toate {totalQuestions} întrebările, răspuns instant la click,
              explicație după fiecare. Fără timp, filtru pe categorii.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-accent transition-transform group-hover:translate-x-0.5">
            Începe
            <ArrowRight className="size-4" />
          </div>
        </Link>
      </div>

      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Examene simulate
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
            Testează-te ca la examen
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Cronometru · prag {course.passingScore}%
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examSets.map((s, i) => (
          <ExamCard
            key={s.number}
            href={`/curs/${course.slug}/test/examen/${s.number}`}
            label={s.label}
            questionCount={s.questionCount}
            durationMin={s.durationMin}
            bestScore={bestScoreByExam?.[s.number] ?? 0}
            passingScore={course.passingScore}
            delay={i * 0.05}
          />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Examenele sunt deterministice — Examen 1 conține mereu aceleași
        întrebări. Ordinea se amestecă la fiecare reîncercare.
      </p>
    </div>
  );
}

interface ExamCardProps {
  href: string;
  label: string;
  questionCount: number;
  durationMin: number;
  bestScore: number;
  passingScore: number;
  delay: number;
}

function ExamCard({
  href,
  label,
  questionCount,
  durationMin,
  bestScore,
  passingScore,
  delay,
}: ExamCardProps) {
  const passed = bestScore >= passingScore;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Link
        href={href}
        className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="size-4" strokeWidth={2} />
          </span>
          {bestScore > 0 && (
            <span
              className={
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-bold tabular-nums " +
                (passed
                  ? "bg-success/15 text-success"
                  : "bg-warning/15 text-warning")
              }
            >
              {passed && <Sparkles className="size-3" />}
              {bestScore}%
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold tracking-tight">{label}</h3>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat
            icon={<ListChecks className="size-3.5" />}
            label="Întrebări"
            value={String(questionCount)}
          />
          <Stat
            icon={<Clock className="size-3.5" />}
            label="Durată"
            value={`${durationMin} min`}
          />
        </div>

        <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold text-foreground transition-transform group-hover:translate-x-0.5">
          {bestScore > 0 ? "Reîncearcă" : "Pornește"}
          <ArrowRight className="size-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      <p className="mt-0.5 font-mono text-sm font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}

// Re-exported for type-only use elsewhere if needed.
export type { ExamSet };

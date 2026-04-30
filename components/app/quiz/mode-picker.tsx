"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Trophy,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  ListChecks,
  CheckCircle2,
} from "lucide-react";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import type { CourseMeta } from "@/lib/content/courses/types";

export interface TestCardData {
  number: number;
  questionCount: number;
  durationMin: number;
}

interface ModePickerProps {
  course: CourseMeta;
  totalQuestions: number;
  sets: TestCardData[];
  /** Best practice score per set number (0..100). */
  practiceBestByN?: Record<number, number>;
  /** Best exam score per set number (0..100). */
  examBestByN?: Record<number, number>;
}

export function ModePicker({
  course,
  totalQuestions,
  sets,
  practiceBestByN,
  examBestByN,
}: ModePickerProps) {
  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-10 md:py-14 lg:px-6">
      <header className="mb-8 flex flex-col items-center text-center md:mb-12">
        <CourseIcon slug={course.slug} src={course.icon} size={56} />
        <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Teste • {course.title.split(" — ")[0]}
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          {sets.length} teste · {sets.length} examene
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {totalQuestions} întrebări împărțite în {sets.length} seturi.
          Fiecare set are două moduri: <span className="font-semibold text-accent">Practice</span> (cu feedback)
          sau <span className="font-semibold text-primary">Examen</span> (cronometrat, format Certiport).
        </p>
      </header>

      {/* PRACTICE TESTS */}
      <SectionHeader
        kind="practice"
        title="Practice tests"
        subtitle="Învață cu feedback instant"
        chip={`${sets.length} teste`}
        helper="Fără timp · răspuns instant la fiecare click · explicație"
      />

      <div className="mb-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {sets.map((s, i) => (
          <TestCard
            key={`p-${s.number}`}
            kind="practice"
            href={`/curs/${course.slug}/test/practice/${s.number}`}
            number={s.number}
            questionCount={s.questionCount}
            durationMin={s.durationMin}
            bestScore={practiceBestByN?.[s.number] ?? 0}
            passingScore={course.passingScore}
            delay={i * 0.04}
          />
        ))}
      </div>

      {/* EXAM SIMULATIONS */}
      <SectionHeader
        kind="exam"
        title="Examene simulate"
        subtitle="Format Certiport · cronometrat · scor real"
        chip={`${sets.length} examene`}
        helper={`${sets[0]?.questionCount ?? 40} întrebări · ${sets[0]?.durationMin ?? 50} min · prag ${course.passingScore}%`}
      />

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {sets.map((s, i) => (
          <TestCard
            key={`e-${s.number}`}
            kind="exam"
            href={`/curs/${course.slug}/test/examen/${s.number}`}
            number={s.number}
            questionCount={s.questionCount}
            durationMin={s.durationMin}
            bestScore={examBestByN?.[s.number] ?? 0}
            passingScore={course.passingScore}
            delay={i * 0.04}
          />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Practice și Examen au aceleași seturi de întrebări (Set 1 = aceeași
        întrebări în ambele moduri). Ordinea se amestecă la fiecare sesiune.
      </p>
    </div>
  );
}

function SectionHeader({
  kind,
  title,
  subtitle,
  chip,
  helper,
}: {
  kind: "practice" | "exam";
  title: string;
  subtitle: string;
  chip: string;
  helper: string;
}) {
  const isPractice = kind === "practice";
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div className="min-w-0 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-xl",
            isPractice ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary",
          )}
        >
          {isPractice ? (
            <Target className="size-4" strokeWidth={2.25} />
          ) : (
            <Trophy className="size-4" strokeWidth={2.25} />
          )}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
              {title}
            </h2>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                isPractice
                  ? "bg-accent/10 text-accent"
                  : "bg-primary/10 text-primary",
              )}
            >
              {chip}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground sm:text-xs">{helper}</p>
    </div>
  );
}

interface TestCardProps {
  kind: "practice" | "exam";
  href: string;
  number: number;
  questionCount: number;
  durationMin: number;
  bestScore: number;
  passingScore: number;
  delay: number;
}

function TestCard({
  kind,
  href,
  number,
  questionCount,
  durationMin,
  bestScore,
  passingScore,
  delay,
}: TestCardProps) {
  const isPractice = kind === "practice";
  const isPassed = bestScore >= passingScore && bestScore > 0;
  const scoreLabel = isPractice ? "Best" : "Scor";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Link
        href={href}
        className={cn(
          "group relative flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5",
          isPractice
            ? "border-border hover:border-accent/40 hover:shadow-accent/5"
            : "border-border hover:border-primary/40 hover:shadow-primary/5",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg font-mono text-xs font-bold tabular-nums",
              isPractice
                ? "bg-accent/10 text-accent"
                : "bg-primary/10 text-primary",
            )}
          >
            #{number}
          </span>
          {bestScore > 0 ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums",
                isPassed
                  ? "bg-success/15 text-success"
                  : "bg-warning/15 text-warning",
              )}
            >
              {isPassed && <CheckCircle2 className="size-3" />}
              {scoreLabel} {bestScore}%
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Nou
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold tracking-tight">
          {isPractice ? "Practice" : "Examen"} {number}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Stat
            icon={<ListChecks className="size-3.5" />}
            label="Întrebări"
            value={String(questionCount)}
          />
          {isPractice ? (
            <Stat
              icon={<Sparkles className="size-3.5" />}
              label="Mod"
              value="Feedback"
            />
          ) : (
            <Stat
              icon={<Clock className="size-3.5" />}
              label="Durată"
              value={`${durationMin} min`}
            />
          )}
        </div>

        <div
          className={cn(
            "mt-auto flex items-center gap-1.5 pt-4 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5",
            isPractice ? "text-accent" : "text-primary",
          )}
        >
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
    <div className="rounded-lg bg-muted/40 px-2.5 py-1.5">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      <p className="mt-0.5 truncate font-mono text-[13px] font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}

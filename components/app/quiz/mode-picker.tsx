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
} from "lucide-react";
import { CourseIcon } from "@/components/shared/course-icon";
import type { CourseMeta } from "@/lib/content/courses/types";

interface ModePickerProps {
  course: CourseMeta;
  questionCount: number;
}

export function ModePicker({ course, questionCount }: ModePickerProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14 lg:px-6">
      <header className="mb-8 flex flex-col items-center text-center md:mb-10">
        <CourseIcon slug={course.slug} src={course.icon} size={56} />
        <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Test • {course.title}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Alege modul de testare
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {questionCount} întrebări reale de la examen, două moduri pentru cum
          le abordezi.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <ModeCard
          href={`/curs/${course.slug}/test/practice`}
          icon={<Target className="size-5" strokeWidth={2} />}
          accent="accent"
          title="Practice"
          tagline="Învață în timp ce răspunzi"
          features={[
            "Răspuns instant — vezi corect/greșit la click",
            "Explicație după fiecare întrebare",
            "Fără timp, fără presiune",
            "Filtrează pe categorii",
          ]}
          cta="Începe practica"
          delay={0}
        />

        <ModeCard
          href={`/curs/${course.slug}/test/examen`}
          icon={<Trophy className="size-5" strokeWidth={2} />}
          accent="primary"
          title="Examen simulat"
          tagline="Cum e la examenul real"
          features={[
            "60 minute, 50 întrebări (configurabil)",
            "Rezultate doar la final, ca la Certiport",
            "Punctaj salvat în istoricul tău",
            `Trec ≥ ${course.passingScore}% — ca la examen`,
          ]}
          cta="Pornește examenul"
          delay={0.08}
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" />
              Recomandat
            </span>
          }
        />
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Întrebările se amestecă la fiecare sesiune, iar răspunsurile rămân
        confidențiale până apeși „Trimite".
      </p>
    </div>
  );
}

interface ModeCardProps {
  href: string;
  icon: React.ReactNode;
  accent: "accent" | "primary";
  title: string;
  tagline: string;
  features: string[];
  cta: string;
  delay: number;
  badge?: React.ReactNode;
}

function ModeCard({
  href,
  icon,
  accent,
  title,
  tagline,
  features,
  cta,
  delay,
  badge,
}: ModeCardProps) {
  const isPrimary = accent === "primary";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Link
        href={href}
        className={
          "group block h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg md:p-8 " +
          (isPrimary
            ? "border-primary/30 hover:border-primary/60 hover:shadow-primary/15"
            : "border-border hover:border-foreground/20")
        }
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={
              "inline-flex size-11 items-center justify-center rounded-xl " +
              (isPrimary
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent")
            }
          >
            {icon}
          </span>
          {badge}
        </div>

        <h3 className="mt-5 text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{tagline}</p>

        <ul className="mt-5 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckCircle2
                className={
                  "mt-0.5 size-4 shrink-0 " +
                  (isPrimary ? "text-primary/70" : "text-accent/80")
                }
                strokeWidth={2.25}
              />
              <span className="text-foreground/80">{f}</span>
            </li>
          ))}
        </ul>

        <div
          className={
            "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-0.5 " +
            (isPrimary ? "text-primary" : "text-foreground")
          }
        >
          {cta}
          <ArrowRight className="size-4" />
        </div>
      </Link>
    </motion.div>
  );
}

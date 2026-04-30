"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  pathway,
  courseSyllabi,
  type PathwayStep,
} from "@/lib/content";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CourseIcon } from "@/components/shared/course-icon";

export function Pathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section
      id="pathway"
      ref={containerRef}
      className="scroll-mt-20 hidden md:block"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex h-dvh w-full flex-col overflow-hidden">
        <Reveal
          staggerChildren={0.12}
          amount={0}
          className="absolute inset-x-0 top-12 z-10 mx-auto max-w-3xl px-6 text-center lg:px-8"
        >
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pathway
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              3 capitole. 1 ordine.{" "}
              <span className="text-muted-foreground">Nota 10.</span>
            </h2>
          </RevealItem>
        </Reveal>

        <motion.ol
          style={{ x }}
          className="flex w-[300vw] grow items-center will-change-transform"
        >
          {pathway.map((step, i) => (
            <PathwayCard key={step.slug} step={step} index={i} />
          ))}
        </motion.ol>

        <ProgressIndicator progress={scrollYProgress} />
      </div>

      <div className="bg-background py-12">
        <p className="mx-auto max-w-3xl px-4 text-center text-sm text-muted-foreground md:text-base">
          <span className="font-medium text-foreground">
            Total estimat: 6–10 săptămâni.
          </span>{" "}
          Mai puțin dacă ai bază. Le poți face și în altă ordine.
        </p>
      </div>
    </section>
  );
}

function PathwayCard({ step, index }: { step: PathwayStep; index: number }) {
  const syllabus = courseSyllabi[step.slug];
  const previewTopics = syllabus.topics.slice(0, 4);

  return (
    <li className="flex w-screen shrink-0 items-center justify-center px-12">
      <article
        className="relative flex w-full max-w-5xl items-stretch overflow-hidden rounded-3xl border border-border bg-card"
        style={{ minHeight: "min(560px, 70vh)" }}
      >
        {/* Subtle dot pattern background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between gap-8 p-10 md:p-14 lg:p-16">
          {/* TOP — eyebrow + title */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / 03
              </span>
              <span className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {step.tag}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Examen {step.examLetter}
              </span>
            </div>

            <div className="flex items-end gap-5">
              <CourseIcon slug={step.slug} size={84} alt="" />
              <h3 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {step.title}
              </h3>
            </div>

            <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
              {syllabus.intro}
            </p>
          </div>

          {/* BOTTOM — topic preview + duration + cta */}
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Capitole · {syllabus.topics.length} total
              </p>
              <ol className="space-y-2.5">
                {previewTopics.map((topic, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-3 text-sm md:text-base"
                  >
                    <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-medium text-foreground">
                      {topic.title}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {topic.weight}
                    </span>
                  </li>
                ))}
                {syllabus.topics.length > previewTopics.length && (
                  <li className="ml-7 text-xs text-muted-foreground/60">
                    + {syllabus.topics.length - previewTopics.length} mai
                  </li>
                )}
              </ol>
            </div>

            <div className="space-y-3 lg:col-span-5 lg:items-end lg:text-right">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4" />
                <span className="font-mono text-sm font-medium tabular-nums">
                  {step.duration}
                </span>
              </div>
              <div>
                <a
                  href="/cursuri"
                  className={cn(
                    "group/cta inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
                    "hover:border-foreground hover:bg-foreground hover:text-background"
                  )}
                >
                  Vezi programa
                  <ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

function ProgressIndicator({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="absolute inset-x-0 bottom-12 mx-auto flex max-w-md items-center gap-4 px-6">
      <ProgressSegment progress={progress} segIndex={0} />
      <ProgressSegment progress={progress} segIndex={1} />
      <ProgressSegment progress={progress} segIndex={2} />
    </div>
  );
}

function ProgressSegment({
  progress,
  segIndex,
}: {
  progress: MotionValue<number>;
  segIndex: number;
}) {
  const segStart = segIndex * 0.33;
  const segEnd = Math.min(1, segStart + 0.33);
  const fillWidth = useTransform(progress, [segStart, segEnd], ["0%", "100%"]);
  return (
    <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
      <motion.div
        className="absolute inset-y-0 left-0 bg-foreground"
        style={{ width: fillWidth }}
      />
    </div>
  );
}

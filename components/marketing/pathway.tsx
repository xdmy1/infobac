"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "motion/react";
import { ArrowRight, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  pathway,
  courseSyllabi,
  type PathwayStep,
} from "@/lib/content";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CourseIcon } from "@/components/shared/course-icon";

export function Pathway() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });

  return (
    <section id="pathway" className="scroll-mt-20 py-24 md:py-32">
      <Reveal
        staggerChildren={0.1}
        amount={0.3}
        className="mx-auto mb-14 max-w-3xl px-6 text-center md:mb-20 lg:px-8"
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
        <RevealItem variant="fade-up">
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            6–10 săptămâni total. Mai puțin dacă ai bază. Le poți face și în
            altă ordine.
          </p>
        </RevealItem>
      </Reveal>

      <div className="px-6 lg:px-8">
        <div ref={railRef} className="relative mx-auto max-w-5xl">
          {/* Vertical rail — passes through every node center */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 left-8 top-8 w-px md:bottom-14 md:left-14 md:top-14"
          >
            <div className="absolute inset-0 bg-border" />
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute inset-0 origin-top bg-foreground"
            />
          </div>

          <ol className="space-y-10 md:space-y-16">
            {pathway.map((step, i) => (
              <PathwayRow key={step.slug} step={step} index={i} />
            ))}
          </ol>

          {/* Destination — closes the rail */}
          <Reveal
            amount={0.5}
            staggerChildren={0.08}
            className="relative mt-10 flex items-center gap-5 md:mt-16 md:gap-8"
          >
            <RevealItem variant="scale-in">
              <div className="relative grid size-16 shrink-0 place-items-center rounded-full border-2 border-foreground bg-background md:size-28">
                <div className="grid size-10 place-items-center rounded-full bg-foreground text-background md:size-16">
                  <Check className="size-5 md:size-7" strokeWidth={3} />
                </div>
              </div>
            </RevealItem>
            <RevealItem variant="fade-up">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Destinație
                </p>
                <p className="mt-1 text-balance text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                  BAC informatică ·{" "}
                  <span className="text-muted-foreground">Nota 10</span>
                </p>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PathwayRow({ step, index }: { step: PathwayStep; index: number }) {
  const syllabus = courseSyllabi[step.slug];
  const previewTopics = syllabus.topics.slice(0, 4);
  const remaining = syllabus.topics.length - previewTopics.length;

  return (
    <li className="relative flex items-start gap-5 md:gap-8">
      {/* Node — anchored on the rail */}
      <Reveal amount={0.4} as="div" className="shrink-0">
        <RevealItem variant="scale-in">
          <div className="relative grid size-16 place-items-center rounded-full border-2 border-foreground bg-background md:size-28">
            <CourseIcon
              slug={step.slug}
              size={40}
              alt=""
              className="md:hidden"
            />
            <CourseIcon
              slug={step.slug}
              size={64}
              alt=""
              className="hidden md:block"
            />
            <span
              className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-background bg-foreground font-mono text-[9px] font-bold tabular-nums text-background md:size-9 md:text-xs"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </RevealItem>
      </Reveal>

      {/* Card */}
      <Reveal
        amount={0.2}
        staggerChildren={0.05}
        as="article"
        className="min-w-0 flex-1 rounded-2xl border border-border bg-card"
      >
        <div className="flex flex-col gap-5 p-5 md:gap-7 md:p-10">
          <RevealItem variant="fade-up">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {step.tag}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Examen {step.examLetter}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                <span className="font-mono text-xs font-medium tabular-nums">
                  {step.duration}
                </span>
              </span>
            </div>
          </RevealItem>

          <RevealItem variant="fade-up">
            <h3 className="text-balance text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {step.title}
            </h3>
          </RevealItem>

          <RevealItem variant="fade-up">
            <p className="text-pretty text-sm text-muted-foreground md:text-lg">
              {syllabus.intro}
            </p>
          </RevealItem>

          <RevealItem variant="fade-up">
            <div className="border-t border-border pt-5 md:pt-6">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Capitole · {syllabus.topics.length} total
              </p>
              <ol className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-6">
                {previewTopics.map((topic, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-3 text-sm"
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
              </ol>
              {remaining > 0 && (
                <p className="mt-3 text-xs text-muted-foreground/70">
                  + {remaining} capitole în cursul complet
                </p>
              )}
            </div>
          </RevealItem>

          <RevealItem variant="fade-up">
            <Link
              href="/cursuri"
              className={cn(
                "group/cta inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
                "hover:border-foreground hover:bg-foreground hover:text-background"
              )}
            >
              Vezi programa
              <ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </RevealItem>
        </div>
      </Reveal>
    </li>
  );
}

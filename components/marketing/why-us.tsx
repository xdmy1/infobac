"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

interface ContrastRow {
  no: string;
  label: string;
  before: string;
  after: string;
  beforeNote?: string;
  afterNote?: string;
}

const rows: ContrastRow[] = [
  {
    no: "01",
    label: "Preț",
    before: "~1.000 EUR",
    beforeNote: "per program",
    after: "950 MDL",
    afterNote: "pachetul de 6 luni",
  },
  {
    no: "02",
    label: "Durată",
    before: "10 luni",
    beforeNote: "o ședință pe săptămână",
    after: "6 săptămâni",
    afterNote: "în ritmul tău",
  },
  {
    no: "03",
    label: "Acces",
    before: "Fizic, în Chișinău",
    beforeNote: "te aliniezi la programul lor",
    after: "100% online",
    afterNote: "de oriunde, oricând",
  },
  {
    no: "04",
    label: "Predare",
    before: "Profesori vechi",
    beforeNote: "n-au dat examenul recent",
    after: "Elevi care au luat 10",
    afterNote: "acum câteva luni",
  },
  {
    no: "05",
    label: "Materiale",
    before: "Generice",
    beforeNote: "filler academic",
    after: "Programa Certiport exactă",
    afterNote: "nimic în plus",
  },
  {
    no: "06",
    label: "Timp",
    before: "Programul lor",
    beforeNote: "cursuri când pot ei",
    after: "Tu decizi",
    afterNote: "lecții accesibile 24/7",
  },
];

export function WhyUs() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border bg-background py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* HEADER */}
        <Reveal staggerChildren={0.12} className="mb-16 max-w-3xl md:mb-20">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              De ce InfoBac
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-4 text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-muted-foreground line-through decoration-destructive/40 decoration-[3px]">
                1.000 EUR
              </span>{" "}
              pentru 10 luni de cursuri o dată pe săptămână?
            </h2>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              Asta e nebunesc.{" "}
              <span className="font-medium text-foreground">
                Iată ce primești cu InfoBac în schimb.
              </span>
            </p>
          </RevealItem>
        </Reveal>

        {/* IMMERSIVE COMPARISON CARD */}
        <Reveal variant="fade-up" delay={0.2} duration={0.9}>
          <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] shadow-2xl">
            {/* Subtle gradient backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 0% 0%, rgba(239, 68, 68, 0.10), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(132, 204, 22, 0.18), transparent 60%)",
              }}
            />

            {/* Column header row */}
            <div className="relative grid grid-cols-12 gap-4 border-b border-white/10 px-6 py-5 md:px-10 md:py-6">
              <div className="col-span-1" />
              <div className="col-span-5 sm:col-span-5 md:col-span-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-destructive/70">
                  Platforme fizice MD
                </p>
                <p className="mt-1 text-xs text-white/40">cum era până acum</p>
              </div>
              <div className="col-span-1 hidden md:block" />
              <div className="col-span-6 sm:col-span-5 md:col-span-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  InfoBac
                </p>
                <p className="mt-1 text-xs text-white/40">cum e cu noi</p>
              </div>
            </div>

            {/* Comparison rows */}
            <ol className="relative divide-y divide-white/5">
              {rows.map((row, i) => (
                <ContrastRow key={row.no} row={row} index={i} />
              ))}
            </ol>

            {/* Footer summary */}
            <div className="relative border-t border-white/10 bg-white/[0.02] px-6 py-6 md:px-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-white/60 md:text-base">
                  Diferență netă, calculată pe Lifetime vs program complet:
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold tabular-nums text-accent md:text-5xl">
                    −90%
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white/40">
                    cost
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContrastRow({
  row,
  index,
}: {
  row: ContrastRow;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.6,
        delay: 0.05 + index * 0.07,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group relative grid grid-cols-12 items-center gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02] md:px-10 md:py-6"
    >
      {/* Index + label */}
      <div className="col-span-1 flex flex-col gap-1">
        <span className="font-mono text-[10px] font-bold tabular-nums text-white/30">
          {row.no}
        </span>
        <span className="hidden font-mono text-[9px] uppercase tracking-widest text-white/40 md:block">
          {row.label}
        </span>
      </div>

      {/* BEFORE — strikethrough, muted */}
      <div className="col-span-5 sm:col-span-5 md:col-span-5">
        <p
          className={cn(
            "font-mono text-base font-semibold tabular-nums tracking-tight text-white/40 md:text-lg",
            "line-through decoration-destructive/40 decoration-[2px]"
          )}
        >
          {row.before}
        </p>
        {row.beforeNote && (
          <p className="mt-1 text-xs text-white/30 md:text-sm">
            {row.beforeNote}
          </p>
        )}
      </div>

      {/* Arrow connector */}
      <div className="col-span-1 hidden items-center justify-center md:flex">
        <ArrowRight className="size-4 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-accent" />
      </div>

      {/* AFTER — bold, lime accent */}
      <div className="col-span-6 sm:col-span-5 md:col-span-5">
        <p className="font-mono text-base font-bold tabular-nums tracking-tight text-white md:text-xl">
          {row.after}
        </p>
        {row.afterNote && (
          <p className="mt-1 text-xs text-accent/80 md:text-sm">
            {row.afterNote}
          </p>
        )}
      </div>
    </motion.li>
  );
}

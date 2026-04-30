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
    <section className="border-t border-border bg-muted/20 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal staggerChildren={0.12} className="mb-14 max-w-3xl md:mb-20">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              De ce InfoBac
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-muted-foreground line-through decoration-muted-foreground/30">
                1.000 EUR
              </span>{" "}
              pentru 10 luni de cursuri o dată pe săptămână?
            </h2>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              Asta e nebunesc.{" "}
              <span className="font-medium text-foreground">
                Iată ce primești cu InfoBac în schimb.
              </span>
            </p>
          </RevealItem>
        </Reveal>

        <Reveal variant="fade-up" delay={0.2} duration={0.9}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Column header */}
            <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/40 px-6 py-4 md:px-10 md:py-5">
              <div className="col-span-1" />
              <div className="col-span-5 sm:col-span-5 md:col-span-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Platforme fizice MD
                </p>
              </div>
              <div className="col-span-1 hidden md:block" />
              <div className="col-span-6 sm:col-span-5 md:col-span-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                  InfoBac
                </p>
              </div>
            </div>

            {/* Rows */}
            <ol className="divide-y divide-border">
              {rows.map((row, i) => (
                <ContrastRow key={row.no} row={row} index={i} />
              ))}
            </ol>

            {/* Footer summary */}
            <div className="border-t border-border bg-muted/20 px-6 py-5 md:px-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Diferență netă, calculată pe pachetul de 6 luni vs program complet:
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-bold tabular-nums">
                    −95%
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
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

function ContrastRow({ row, index }: { row: ContrastRow; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.5,
        delay: 0.05 + index * 0.05,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group grid grid-cols-12 items-center gap-4 px-6 py-5 md:px-10 md:py-6"
    >
      <div className="col-span-1 flex flex-col gap-1">
        <span className="font-mono text-[10px] font-medium tabular-nums text-muted-foreground/60">
          {row.no}
        </span>
        <span className="hidden font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:block">
          {row.label}
        </span>
      </div>

      <div className="col-span-5 sm:col-span-5 md:col-span-5">
        <p
          className={cn(
            "font-mono text-base font-semibold tabular-nums tracking-tight text-muted-foreground/70 md:text-lg",
            "line-through decoration-muted-foreground/30"
          )}
        >
          {row.before}
        </p>
        {row.beforeNote && (
          <p className="mt-1 text-xs text-muted-foreground/60 md:text-sm">
            {row.beforeNote}
          </p>
        )}
      </div>

      <div className="col-span-1 hidden items-center justify-center md:flex">
        <ArrowRight className="size-4 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-foreground" />
      </div>

      <div className="col-span-6 sm:col-span-5 md:col-span-5">
        <p className="font-mono text-base font-bold tabular-nums tracking-tight text-foreground md:text-lg">
          {row.after}
        </p>
        {row.afterNote && (
          <p className="mt-1 text-xs text-muted-foreground md:text-sm">
            {row.afterNote}
          </p>
        )}
      </div>
    </motion.li>
  );
}

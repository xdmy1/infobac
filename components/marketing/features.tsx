"use client";

import { motion } from "motion/react";
import {
  Headphones,
  TrendingUp,
  Zap,
  Clock4,
  CheckCircle2,
} from "lucide-react";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section className="border-t border-border py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal staggerChildren={0.12} className="mb-14 max-w-2xl md:mb-20">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ce primești
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-3 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Tot ce-ți trebuie.{" "}
              <span className="text-muted-foreground">Nimic în plus.</span>
            </h2>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
              Construit pentru un singur obiectiv — să iei 10. Fără cursuri
              „bonus" pe care nu le folosești niciodată.
            </p>
          </RevealItem>
        </Reveal>

        <Reveal
          staggerChildren={0.08}
          amount={0.05}
          className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4"
          as="ul"
        >
          <RevealItem
            variant="fade-up"
            as="li"
            className="md:col-span-3 md:row-span-2"
          >
            <CardProgrameExacta />
          </RevealItem>

          <RevealItem variant="fade-up" as="li" className="md:col-span-3">
            <CardTeste />
          </RevealItem>

          <RevealItem variant="fade-up" as="li" className="md:col-span-2">
            <CardMonitorizare />
          </RevealItem>

          <RevealItem variant="fade-up" as="li" className="md:col-span-1">
            <CardSuport />
          </RevealItem>

          <RevealItem variant="fade-up" as="li" className="md:col-span-3">
            <CardEchipa />
          </RevealItem>

          <RevealItem variant="fade-up" as="li" className="md:col-span-3">
            <CardRitm />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

// =============================================================================
// HERO — Programa exactă: light, editorial, calm
// =============================================================================

function CardProgrameExacta() {
  const items = [
    { text: "Operatori și tipuri de date", relevant: true, weight: "20%" },
    { text: "Istoria limbajelor de programare", relevant: false },
    { text: "Flow control — if, while, for", relevant: true, weight: "25%" },
    { text: "Algoritmi P vs NP", relevant: false },
    { text: "Funcții și module", relevant: true, weight: "15%" },
    { text: "Filozofia științei calculatoarelor", relevant: false },
    { text: "Input/output cu fișiere", relevant: true, weight: "20%" },
    { text: "Quantum computing intro", relevant: false },
    { text: "Try/except și debugging", relevant: true, weight: "10%" },
  ];

  const relevantCount = items.filter((i) => i.relevant).length;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 md:p-10 lg:p-12">
      <div className="mb-8 flex items-start justify-between gap-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Hero feature
        </p>
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-mono text-6xl font-bold tabular-nums tracking-tighter text-foreground md:text-7xl">
            <CountUp to={relevantCount} />
          </span>
          <span className="font-mono text-lg font-bold tabular-nums text-muted-foreground/40">
            / {items.length}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-balance text-4xl font-bold leading-[0.95] tracking-tight md:text-5xl">
          Programa.
          <br />
          <span className="text-muted-foreground">Exactă.</span>
        </h3>
        <p className="mt-4 max-w-md text-pretty text-base text-muted-foreground">
          Doar capitolele care apar la Certiport. Restul — taie-l. Vezi mai
          jos ce verificăm și ce ignorăm.
        </p>
      </div>

      <ul className="mt-8 grow space-y-0">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.04 }}
            className={cn(
              "flex items-baseline gap-3 border-b border-border/60 py-2.5 text-sm",
              item.relevant
                ? "text-foreground"
                : "text-muted-foreground/40 line-through decoration-muted-foreground/30"
            )}
          >
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">{item.text}</span>
            {item.relevant && item.weight && (
              <span className="font-mono text-[10px] font-semibold tabular-nums text-foreground">
                {item.weight}
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </article>
  );
}

// =============================================================================
// CardTeste — Mini exam UI cu progress (calm)
// =============================================================================

function CardTeste() {
  return (
    <article className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-7 md:p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Identice cu examenul
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Simulări 1:1
          </h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold tabular-nums">
            40<span className="text-base text-muted-foreground/50">×</span>3
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            întrebări per examen
          </p>
        </div>
      </div>

      <div className="grow rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="font-mono">Q 12 / 40</span>
          <div className="flex items-center gap-1">
            <Clock4 className="size-3" />
            <span className="font-mono tabular-nums">38:24</span>
          </div>
        </div>

        <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            whileInView={{ width: "30%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </div>

        <p className="text-sm font-semibold leading-snug">
          Ce returnează expresia{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
            5 / 2
          </code>
          ?
        </p>

        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
            <span className="size-3 rounded-full border border-border" />
            <span className="text-muted-foreground">A. int (2)</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-foreground bg-muted/40 px-2.5 py-1.5">
            <span className="size-3 rounded-full border border-foreground bg-foreground" />
            <span className="font-medium">B. float (2.5)</span>
            <CheckCircle2
              className="ml-auto size-3.5 text-foreground"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// CardMonitorizare — chart visual (calm)
// =============================================================================

function CardMonitorizare() {
  const topics = [
    { label: "JOIN-uri", percent: 32 },
    { label: "try / except", percent: 55 },
    { label: "List compr.", percent: 92 },
  ];

  return (
    <article className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:p-7">
      <div>
        <span
          className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground/70"
          aria-hidden
        >
          <TrendingUp className="size-5" strokeWidth={1.75} />
        </span>
        <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
          Vezi ce-ți e slab.
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Și apoi atacă acolo, nu peste tot.
        </p>
      </div>

      <div className="grow space-y-2.5">
        {topics.map((t, i) => (
          <div key={t.label} className="flex items-center gap-3">
            <span className="w-24 text-xs font-medium">{t.label}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${t.percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                className="h-full rounded-full bg-foreground"
              />
            </div>
            <span className="w-9 text-right font-mono text-[11px] font-medium tabular-nums text-muted-foreground">
              {t.percent}%
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Topic-uri tracking · sesiunea curentă
      </p>
    </article>
  );
}

// =============================================================================
// CardSuport — chat thread (calm)
// =============================================================================

function CardSuport() {
  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground/70">
          <Headphones className="size-5" strokeWidth={1.75} />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-foreground" />
          live
        </span>
      </div>

      <h3 className="text-xl font-bold tracking-tight">Suport 24/7.</h3>

      <div className="grow space-y-1.5 rounded-xl bg-muted/40 p-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
            23:42
          </span>
          <p className="rounded-lg rounded-tl-sm bg-background px-2.5 py-1.5 text-xs font-medium">
            stuck la JOIN
          </p>
        </div>
        <div className="flex items-baseline justify-end gap-2">
          <p className="rounded-lg rounded-tr-sm bg-foreground px-2.5 py-1.5 text-xs font-medium text-background">
            arăt acum
          </p>
          <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
            23:43
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Răspuns mediu
        </span>
        <span className="font-mono text-sm font-bold tabular-nums">
          ~ 4 min
        </span>
      </div>
    </article>
  );
}

// =============================================================================
// CardEchipa — split layout, calm
// =============================================================================

function CardEchipa() {
  const team = [
    { initials: "AP" },
    { initials: "VM" },
    { initials: "CS" },
    { initials: "RD" },
  ];

  return (
    <article className="flex h-full rounded-3xl border border-border bg-card">
      <div className="grid w-full grid-cols-1 gap-6 p-7 md:grid-cols-5 md:gap-0 md:p-8">
        <div className="md:col-span-3 md:pr-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Echipa fondatorilor
          </p>
          <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
            Făcut de elevi.
            <br />
            <span className="text-muted-foreground">Pentru elevi.</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Am dat aceleași 3 examene anul trecut. Ce-ți spunem să faci e ce
            a funcționat la noi — testat în condiții reale.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-5 border-t border-border pt-5 md:col-span-2 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Media absolvenți
            </p>
            <p className="mt-1 font-mono text-5xl font-bold tabular-nums leading-none">
              <CountUp to={10} />
              <span className="text-2xl text-muted-foreground/50">/ 10</span>
            </p>
          </div>

          <div>
            <div className="flex -space-x-2">
              {team.map((t, i) => (
                <motion.span
                  key={t.initials}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    damping: 14,
                    stiffness: 200,
                    delay: 0.2 + i * 0.08,
                  }}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-[11px] font-semibold ring-2 ring-card"
                >
                  {t.initials}
                </motion.span>
              ))}
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground ring-2 ring-card">
                +9
              </span>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              13 absolvenți · sesiunea iunie 2025
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// CardRitm — timeline (calm)
// =============================================================================

function CardRitm() {
  const milestones = [
    { week: 0, label: "Start" },
    { week: 4, label: "Python" },
    { week: 7, label: "SQL" },
    { week: 8, label: "Net" },
    { week: 10, label: "Cert" },
  ];

  return (
    <article className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-7 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground/70">
            <Zap className="size-5" strokeWidth={1.75} />
          </span>
          <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            În ritmul tău.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Tu decizi când.</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold tabular-nums">6–10</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            săptămâni total
          </p>
        </div>
      </div>

      <div className="grow">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>S0</span>
          <span>S5</span>
          <span>S10</span>
        </div>

        <div className="relative mt-3 h-0.5 rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="absolute inset-y-0 left-0 rounded-full bg-foreground"
          />
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 200,
                delay: 0.3 + (m.week / 10) * 1.4,
              }}
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-card"
              style={{ left: `${(m.week / 10) * 100}%` }}
            />
          ))}
        </div>

        <ul className="mt-6 space-y-1.5">
          {milestones.slice(1).map((m) => (
            <li
              key={m.label}
              className="flex items-baseline justify-between text-xs"
            >
              <span className="font-medium">{m.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                S{m.week}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

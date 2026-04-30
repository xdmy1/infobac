"use client";

import { motion } from "motion/react";
import {
  Headphones,
  TrendingUp,
  Zap,
  Star,
  Clock4,
} from "lucide-react";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section className="relative border-t border-border bg-muted/10 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal staggerChildren={0.12} className="mb-14 max-w-2xl md:mb-20">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ce primești
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-3 text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
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
          className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5"
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
// HERO — Programa exactă: editorial split, big stat, prominent strikethrough
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
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0a0f1f] p-8 text-white md:p-10 lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(132, 204, 22, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(99, 102, 241, 0.20), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative mb-8 flex items-start justify-between gap-6">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          <Star className="size-3" strokeWidth={2.5} />
          Hero feature
        </p>

        <div className="flex items-baseline gap-2 leading-none">
          <span className="font-mono text-7xl font-bold tabular-nums tracking-tighter text-accent md:text-8xl">
            <CountUp to={relevantCount} />
          </span>
          <span className="font-mono text-xl font-bold tabular-nums text-white/30">
            / {items.length}
          </span>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-balance text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
          Programa.
          <br />
          <span className="text-white/40">Exactă.</span>
        </h3>
        <p className="mt-4 max-w-md text-pretty text-base text-white/60 md:text-lg">
          Doar capitolele care apar la Certiport. Restul — taie-l. Vezi mai
          jos ce verificăm și ce ignorăm.
        </p>
      </div>

      <ul className="relative mt-8 grow space-y-1.5">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            className={cn(
              "flex items-baseline gap-3 border-b border-white/5 py-2 text-sm md:text-base",
              item.relevant
                ? "text-white"
                : "text-white/25 line-through decoration-white/15"
            )}
          >
            <span
              className={cn(
                "font-mono text-[10px] tabular-nums",
                item.relevant ? "text-accent" : "text-white/15"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-medium">{item.text}</span>
            {item.relevant && item.weight && (
              <span className="font-mono text-[10px] font-bold tabular-nums text-accent">
                {item.weight}
              </span>
            )}
            {!item.relevant && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/15">
                cut
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </article>
  );
}

// =============================================================================
// CardTeste — Mini exam UI cu progress
// =============================================================================

function CardTeste() {
  return (
    <article className="relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border-2 border-primary/20 bg-card p-7 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Identice cu examenul
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Simulări 1:1
          </h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold tabular-nums text-primary md:text-4xl">
            40<span className="text-base text-primary/60">×</span>3
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            întrebări per examen
          </p>
        </div>
      </div>

      <div className="relative grow rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="font-mono">Q 12 / 40</span>
          <div className="flex items-center gap-1">
            <Clock4 className="size-3" />
            <span className="font-mono tabular-nums text-warning">38:24</span>
          </div>
        </div>

        <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            whileInView={{ width: "30%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </div>

        <p className="text-sm font-semibold leading-snug text-foreground">
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
          <motion.div
            initial={{ scale: 0.96 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-2 rounded-md border-2 border-primary bg-primary/5 px-2.5 py-1.5 shadow-sm"
          >
            <span className="size-3 rounded-full border-2 border-primary bg-primary" />
            <span className="font-medium">B. float (2.5)</span>
            <span className="ml-auto rounded-full bg-success/15 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-success">
              corect
            </span>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// CardMonitorizare — chart visual + topic distribution
// =============================================================================

function CardMonitorizare() {
  const topics = [
    { label: "JOIN-uri", percent: 32, level: "destructive" as const },
    { label: "try / except", percent: 55, level: "warning" as const },
    { label: "List compr.", percent: 92, level: "success" as const },
  ];

  const colorMap = {
    destructive: "bg-destructive",
    warning: "bg-warning",
    success: "bg-success",
  };
  const textMap = {
    destructive: "text-destructive",
    warning: "text-warning",
    success: "text-success",
  };

  return (
    <article className="relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border-2 border-warning/20 bg-card p-6 md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-warning/10 blur-3xl"
      />

      <div className="relative">
        <span
          className="inline-flex size-10 items-center justify-center rounded-xl bg-warning/15 text-warning"
          aria-hidden
        >
          <TrendingUp className="size-5" strokeWidth={2.25} />
        </span>
        <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
          Vezi ce-ți e slab.
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Și apoi atacă acolo, nu peste tot.
        </p>
      </div>

      <div className="relative grow space-y-2.5">
        {topics.map((t, i) => (
          <div key={t.label} className="flex items-center gap-3">
            <span className="w-24 text-xs font-medium">{t.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${t.percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                className={cn("h-full rounded-full", colorMap[t.level])}
              />
            </div>
            <span
              className={cn(
                "w-9 text-right font-mono text-[11px] font-bold tabular-nums",
                textMap[t.level]
              )}
            >
              {t.percent}%
            </span>
          </div>
        ))}
      </div>

      <p className="relative font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Topic-uri tracking · sesiunea curentă
      </p>
    </article>
  );
}

// =============================================================================
// CardSuport — chat thread cu badge response time
// =============================================================================

function CardSuport() {
  return (
    <article className="relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border-2 border-accent/30 bg-card p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-accent/15 blur-2xl"
      />

      <div className="relative flex items-start justify-between gap-2">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/20 text-accent-hover">
          <Headphones className="size-5" strokeWidth={2.25} />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          live
        </span>
      </div>

      <h3 className="relative text-xl font-bold tracking-tight">
        Suport 24/7.
      </h3>

      <div className="relative grow space-y-1.5 rounded-xl bg-muted/40 p-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
            23:42
          </span>
          <p className="rounded-lg rounded-tl-sm bg-foreground/10 px-2.5 py-1.5 text-xs font-medium">
            stuck la JOIN
          </p>
        </div>
        <div className="flex items-baseline justify-end gap-2">
          <p className="rounded-lg rounded-tr-sm bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground">
            arăt acum
          </p>
          <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
            23:43
          </span>
        </div>
      </div>

      <div className="relative flex items-baseline justify-between border-t border-border pt-3">
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
// CardEchipa — split layout cu stat hero + avatars
// =============================================================================

function CardEchipa() {
  const team = [
    { initials: "AP", color: "bg-primary text-primary-foreground" },
    { initials: "VM", color: "bg-accent text-accent-foreground" },
    { initials: "CS", color: "bg-warning text-warning-foreground" },
    { initials: "RD", color: "bg-success text-white" },
  ];

  return (
    <article className="relative flex h-full overflow-hidden rounded-3xl border-2 border-success/20 bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-success/10 blur-3xl"
      />

      <div className="relative grid w-full grid-cols-1 gap-6 p-7 md:grid-cols-5 md:gap-0 md:p-8">
        <div className="md:col-span-3 md:pr-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-success">
            Echipa fondatorilor
          </p>
          <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Făcut de elevi.
            <br />
            <span className="text-muted-foreground">Pentru elevi.</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Am dat aceleași 3 examene anul trecut. Ce-ți spunem să faci e ce
            a funcționat la noi — testat în condiții reale.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-5 border-t border-border pt-5 md:col-span-2 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Media absolvenți
            </p>
            <p className="mt-1 font-mono text-5xl font-bold tabular-nums leading-none md:text-6xl">
              <CountUp to={10} />
              <span className="text-2xl text-muted-foreground">/ 10</span>
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
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-card",
                    t.color
                  )}
                >
                  {t.initials}
                </motion.span>
              ))}
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground ring-2 ring-card">
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
// CardRitm — timeline 6-10 weeks
// =============================================================================

function CardRitm() {
  const milestones = [
    { week: 0, label: "Start", color: "bg-foreground" },
    { week: 4, label: "Python", color: "bg-primary" },
    { week: 7, label: "SQL", color: "bg-accent" },
    { week: 8, label: "Net", color: "bg-warning" },
    { week: 10, label: "Cert", color: "bg-success" },
  ];

  return (
    <article className="relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border-2 border-primary/20 bg-card p-7 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Zap className="size-5" strokeWidth={2.25} />
          </span>
          <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            În ritmul tău.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Tu decizi când.</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold tabular-nums text-primary md:text-4xl">
            6–10
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            săptămâni total
          </p>
        </div>
      </div>

      <div className="relative grow">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>S0</span>
          <span>S5</span>
          <span>S10</span>
        </div>

        <div className="relative mt-3 h-1 rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-foreground via-primary to-success"
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
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                m.color
              )}
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
              <span className="flex items-center gap-2">
                <span
                  className={cn("size-1.5 rounded-full", m.color)}
                  aria-hidden
                />
                <span className="font-medium text-foreground">{m.label}</span>
              </span>
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

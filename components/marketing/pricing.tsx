"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Sparkles, Crown } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import { pricingPlans } from "@/lib/content";

const formatMDL = (n: number) =>
  new Intl.NumberFormat("ro-MD", { maximumFractionDigits: 0 }).format(n);

export function Pricing() {
  const moduleP = pricingPlans.find((p) => p.id === "module")!;
  const all = pricingPlans.find((p) => p.id === "all")!;
  const semester = pricingPlans.find((p) => p.id === "semester")!;

  return (
    <section
      id="preturi"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal staggerChildren={0.12} className="mb-14 max-w-2xl md:mb-20">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Prețuri
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-3 text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              Trei moduri.{" "}
              <span className="text-muted-foreground">Aceeași materie.</span>
            </h2>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
              Plătește pentru un singur curs sau pentru toate. Pachetul de 6
              luni e cel mai ieftin per lună.
            </p>
          </RevealItem>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {/* HERO PLAN — All (toate modulele) */}
          <Reveal variant="fade-up" delay={0.1} className="lg:col-span-7 lg:row-span-2">
            <StandardPlanCard plan={all} />
          </Reveal>

          {/* SIDE — Module + Semester stacked */}
          <Reveal variant="fade-up" delay={0.25} className="lg:col-span-5">
            <BasicPlanCard plan={moduleP} />
          </Reveal>
          <Reveal variant="fade-up" delay={0.35} className="lg:col-span-5">
            <LifetimePlanCard plan={semester} />
          </Reveal>
        </div>

        <Reveal
          delay={0.4}
          variant="fade-up"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-success" strokeWidth={2.5} />
            Anulezi oricând (planuri lunare)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-success" strokeWidth={2.5} />
            Refund 7 zile pe pachetul de 6 luni
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-success" strokeWidth={2.5} />
            Card + transfer bancar
          </span>
        </Reveal>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// STANDARD — featured, dark with gradient mesh
// -----------------------------------------------------------------------------

function StandardPlanCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-3xl bg-[#0f172a] p-8 shadow-2xl shadow-primary/20 md:p-10 lg:p-12">
      {/* Gradient mesh background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(99, 102, 241, 0.45), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(132, 204, 22, 0.30), transparent 60%), radial-gradient(circle 1px at 30px 30px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "auto, auto, 30px 30px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
            <Sparkles className="size-3 text-accent" />
            Recomandat
          </span>
        </div>

        <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {plan.name}
        </h3>
        <p className="mt-2 text-base text-white/60">{plan.description}</p>

        <div className="mt-8 flex items-baseline gap-2">
          <span className="font-mono text-7xl font-bold tabular-nums tracking-tighter text-white md:text-8xl">
            <CountUp to={plan.priceMDL} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">MDL</span>
            <span className="text-xs text-white/50">/lună</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-white/40">≈ {plan.priceEUR} EUR / lună</p>

        <Link
          href={`/inregistrare?plan=${plan.id}`}
          className="group/cta mt-8 inline-flex items-center justify-between rounded-2xl bg-white px-6 py-4 text-base font-semibold text-[#0f172a] transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20"
        >
          <span>{plan.cta}</span>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform group-hover/cta:translate-x-1">
            <ArrowRight className="size-4" />
          </span>
        </Link>

        <div className="mt-10 grid gap-3 lg:grid-cols-2">
          {plan.features.map((f, i) => {
            const isInherited =
              f.startsWith("Tot din") || f.startsWith("TOT din");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-2.5 text-sm text-white/85"
              >
                <Check
                  strokeWidth={2.5}
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    isInherited ? "text-accent" : "text-white/60"
                  )}
                />
                <span className={cn(isInherited && "font-semibold text-white")}>
                  {f}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

// -----------------------------------------------------------------------------
// BASIC — clean white card, minimal
// -----------------------------------------------------------------------------

function BasicPlanCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg md:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          start
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-mono text-5xl font-bold tabular-nums tracking-tighter">
          <CountUp to={plan.priceMDL} />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold">MDL</span>
          <span className="text-[11px] text-muted-foreground">
            / {plan.priceUnit}
          </span>
        </div>
      </div>
      {plan.requiresCourseSelection && (
        <p className="mt-2 text-xs text-muted-foreground">
          Alegi modulul la înscriere · poți schimba o dată/lună
        </p>
      )}

      <Link
        href={`/inregistrare?plan=${plan.id}`}
        className="group/cta mt-5 inline-flex w-full items-center justify-between rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      >
        <span>{plan.cta}</span>
        <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
      </Link>

      <ul className="mt-6 space-y-2.5 text-sm">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-muted-foreground">
            <Check
              strokeWidth={2.5}
              className="mt-0.5 size-3.5 shrink-0 text-foreground/40"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

// -----------------------------------------------------------------------------
// LIFETIME — dark card with lime accent gradient (premium)
// -----------------------------------------------------------------------------

function LifetimePlanCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  const isSemester = plan.priceUnit === "6 luni";

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl bg-[#0f172a] p-7 shadow-xl shadow-accent/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/20 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 100% 0%, rgba(132, 204, 22, 0.35), transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent backdrop-blur">
              <Crown className="size-3" />
              Best value
            </span>
          </div>
        </div>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
          {plan.name}
        </h3>
        <p className="mt-1 text-sm text-white/60">{plan.description}</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-mono text-5xl font-bold tabular-nums tracking-tighter text-white">
            <CountUp to={plan.priceMDL} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">MDL</span>
            <span className="text-[11px] text-white/50">
              {isSemester ? "/ 6 luni" : plan.priceUnit}
            </span>
          </div>
        </div>
        {plan.effectiveMonthlyMDL && (
          <p className="mt-2 font-mono text-[11px] text-accent/80">
            ≈ {plan.effectiveMonthlyMDL} MDL/lună efectiv · plată unică
          </p>
        )}

        <Link
          href={`/inregistrare?plan=${plan.id}`}
          className="group/cta mt-5 inline-flex w-full items-center justify-between rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30"
        >
          <span>{plan.cta}</span>
          <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
        </Link>

        <ul className="mt-6 space-y-2.5 text-sm">
          {plan.features.map((f, i) => {
            const isInherited =
              f.startsWith("Tot din") || f.startsWith("TOT din");
            return (
              <li
                key={i}
                className="flex items-start gap-2 text-white/75"
              >
                <Check
                  strokeWidth={2.5}
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    isInherited ? "text-accent" : "text-white/40"
                  )}
                />
                <span className={cn(isInherited && "font-semibold text-white")}>
                  {f}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

import { TrackedLink } from "@/components/shared/tracked-link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import { pricingPlans } from "@/lib/content";

export function Pricing({ location = "pricing-section" }: { location?: string } = {}) {
  const moduleP = pricingPlans.find((p) => p.id === "module")!;
  const all = pricingPlans.find((p) => p.id === "all")!;
  const semester = pricingPlans.find((p) => p.id === "semester")!;

  return (
    <section
      id="preturi"
      className="scroll-mt-20 border-t border-border py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal staggerChildren={0.12} className="mb-14 max-w-2xl md:mb-20">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Prețuri
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-3 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
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

        <Reveal staggerChildren={0.1} className="grid gap-4 md:grid-cols-3">
          <RevealItem variant="fade-up">
            <PlanCard plan={moduleP} variant="standard" location={location} />
          </RevealItem>
          <RevealItem variant="fade-up">
            <PlanCard plan={all} variant="featured" location={location} />
          </RevealItem>
          <RevealItem variant="fade-up">
            <PlanCard plan={semester} variant="standard" location={location} emphasizeLabel />
          </RevealItem>
        </Reveal>

        <Reveal
          delay={0.4}
          variant="fade-up"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4" strokeWidth={2} />
            Anulezi oricând (planuri lunare)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4" strokeWidth={2} />
            Primele 2 lecții — gratis
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4" strokeWidth={2} />
            Card + transfer bancar
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  variant,
  location,
  emphasizeLabel = false,
}: {
  plan: (typeof pricingPlans)[number];
  variant: "standard" | "featured";
  /** Where this card is rendered, so the funnel can tell the landing section from /preturi. */
  location: string;
  /** When true, shows the BEST VALUE label without changing the visual. */
  emphasizeLabel?: boolean;
}) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-7 md:p-8",
        isFeatured ? "border-foreground" : "border-border"
      )}
    >
      {isFeatured && plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
            {plan.badge}
          </span>
        </div>
      )}
      {!isFeatured && emphasizeLabel && plan.badge && (
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
          {plan.badge}
        </p>
      )}

      <div>
        <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mt-7 flex items-baseline gap-1.5">
        {/* Static on purpose: the price is the one number that must be
            readable in the markup itself — no JS, no count-up, no scroll. */}
        <span className="font-mono text-5xl font-bold tabular-nums tracking-tighter">
          {plan.priceMDL}
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-xs font-semibold">MDL</span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            / {plan.priceUnit}
          </span>
        </div>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        ≈ {plan.priceEUR} EUR
        {plan.effectiveMonthlyMDL && (
          <>
            {" · "}
            <span className="text-foreground">
              {plan.effectiveMonthlyMDL} MDL/lună efectiv
            </span>
          </>
        )}
      </p>
      {plan.requiresCourseSelection && (
        <p className="mt-2 text-xs text-muted-foreground">
          Alegi modulul la înscriere · poți schimba lunar
        </p>
      )}

      <TrackedLink
        href={`/abonament/cumpara/${plan.id}`}
        event="plan_cta_clicked"
        properties={{ plan: plan.id, location }}
        className={cn(
          "group/cta mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
          isFeatured
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "border border-border text-foreground hover:border-foreground"
        )}
      >
        <span>{plan.cta}</span>
        <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
      </TrackedLink>

      <ul className="mt-7 space-y-2.5 border-t border-border pt-6">
        {plan.features.map((f, i) => {
          const isInherited =
            f.startsWith("Tot din") || f.startsWith("TOT din");
          return (
            // Static, like the price above it: what a plan includes is part of
            // the offer, so it must survive a reader with no JavaScript and a
            // screenshot taken before any observer has fired.
            <li
              key={i}
              className={cn(
                "flex items-start gap-2.5 text-sm",
                isInherited ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              <Check
                strokeWidth={2}
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  isInherited ? "text-foreground" : "text-muted-foreground/60"
                )}
              />
              <span>{f}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

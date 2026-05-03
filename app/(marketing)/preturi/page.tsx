import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { Pricing } from "@/components/marketing/pricing";
import { PricingCompare } from "@/components/marketing/pricing-compare";
import { CtaFinal } from "@/components/marketing/cta-final";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import { pricingFaq, pricingPlans } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import {
  BreadcrumbJsonLd,
  FaqPageJsonLd,
  OffersJsonLd,
} from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Prețuri — de la 250 MDL/lună pentru BAC informatică",
  description:
    "3 planuri pentru pregătirea BAC informatică Moldova: Un modul 250 MDL/lună, Toate modulele 550 MDL/lună (popular), Pe 6 luni 950 MDL (~158 MDL/lună). Plată locală prin MIA.",
  alternates: {
    canonical: "/preturi",
    languages: { "ro-MD": "/preturi" },
  },
  openGraph: {
    title: "Prețuri InfoBac — de la 250 MDL/lună",
    description:
      "3 planuri pentru BAC informatică Moldova: Un modul, Toate modulele, Pe 6 luni. Plată prin MIA.",
    url: `${siteConfig.url}/preturi`,
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          { name: "Prețuri", url: "/preturi" },
        ]}
      />
      <FaqPageJsonLd items={pricingFaq} />
      <OffersJsonLd plans={pricingPlans} />
      <PreturiHero />
      <Pricing />
      <PricingCompare />

      <section className="border-t border-border py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <Reveal staggerChildren={0.08}>
            <RevealItem variant="fade-up">
              <div className="flex items-baseline gap-4 border-b border-border pb-5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  FAQ · Plată
                </span>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Despre plată
                </h2>
                <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
                  {pricingFaq.length} întrebări
                </span>
              </div>
            </RevealItem>

            <RevealItem variant="fade-up">
              <Accordion multiple={false} className="flex flex-col">
                {pricingFaq.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`pricing-faq-${i}`}
                    className={cn(
                      "border-b-0 border-t border-border/60 first:border-t-0"
                    )}
                  >
                    <AccordionTrigger className="gap-4 px-1 py-5 text-base font-semibold md:text-lg">
                      <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{item.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pl-9 pr-1 text-pretty text-sm text-muted-foreground md:text-base">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </RevealItem>

            <RevealItem variant="fade-up">
              <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
                <p className="text-sm font-semibold tracking-tight">
                  Mai ai o întrebare despre plată?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Scrie-ne și răspundem în câteva ore.
                </p>
                <a
                  href="mailto:hello@infobac.md"
                  className="group/cta mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
                >
                  <Mail className="size-4" />
                  <span className="underline decoration-foreground/30 underline-offset-4 group-hover/cta:decoration-primary">
                    hello@infobac.md
                  </span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </a>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}

function PreturiHero() {
  const semester = pricingPlans.find((p) => p.id === "semester")!;
  const all = pricingPlans.find((p) => p.id === "all")!;
  const moduleP = pricingPlans.find((p) => p.id === "module")!;

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* LEFT — title + value prop */}
        <div>
          <Reveal staggerChildren={0.1}>
            <RevealItem variant="fade-up">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prețuri
              </p>
            </RevealItem>
            <RevealItem variant="fade-blur">
              <h1 className="mt-4 text-balance text-5xl font-bold leading-[1] tracking-tight md:text-6xl lg:text-[5.5rem]">
                Cel mai{" "}
                <span className="italic text-muted-foreground">ieftin</span>{" "}
                mod de a lua{" "}
                <span className="bg-gradient-to-br from-accent to-accent-hover bg-clip-text text-transparent">
                  10
                </span>
                .
              </h1>
            </RevealItem>
            <RevealItem variant="fade-up">
              <p className="mt-6 max-w-md text-pretty text-base text-muted-foreground md:text-lg">
                Platformele fizice cer 1.000 EUR pentru 10 luni de cursuri o
                dată pe săptămână. Noi cerem mult mai puțin.
              </p>
            </RevealItem>
          </Reveal>
        </div>

        {/* RIGHT — visual price comparison */}
        <Reveal variant="fade-up" delay={0.3}>
          <div className="space-y-4">
            <ComparisonRow
              label="Platforme fizice MD"
              priceMDL={20000}
              priceEUR={1000}
              negative
            />
            <ComparisonRow
              label="InfoBac · Un modul"
              priceMDL={moduleP.priceMDL}
              priceEUR={moduleP.priceEUR}
              suffix="/lună"
            />
            <ComparisonRow
              label="InfoBac · Toate modulele"
              priceMDL={all.priceMDL}
              priceEUR={all.priceEUR}
              suffix="/lună"
            />
            <ComparisonRow
              label="InfoBac · Pachet 6 luni"
              priceMDL={semester.priceMDL}
              priceEUR={semester.priceEUR}
              suffix="/6 luni"
              highlighted
            />

            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Estimare: pachet 6 luni vs platforme fizice</span>
              <span className="font-mono text-base font-bold tabular-nums text-foreground">
                −95%
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground/70">
              *Prețuri orientative bazate pe oferte publice observate ale
              platformelor fizice locale (2024–2025).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  priceMDL,
  priceEUR,
  suffix,
  negative,
  highlighted,
}: {
  label: string;
  priceMDL: number;
  priceEUR: number;
  suffix?: string;
  negative?: boolean;
  highlighted?: boolean;
}) {
  const formatMDL = new Intl.NumberFormat("ro-MD").format;

  return (
    <div
      className={`group flex items-baseline justify-between gap-4 border-b py-3 ${
        highlighted ? "border-accent" : "border-border"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          negative ? "text-muted-foreground line-through" : "text-foreground"
        }`}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 text-right">
        <span
          className={`font-mono tabular-nums ${
            negative
              ? "text-2xl text-muted-foreground line-through decoration-destructive/40"
              : highlighted
                ? "text-3xl font-bold text-foreground md:text-4xl"
                : "text-2xl font-semibold text-foreground"
          }`}
        >
          {formatMDL(priceMDL)}
        </span>
        <span
          className={`font-mono text-xs ${
            negative ? "text-muted-foreground/60" : "text-muted-foreground"
          }`}
        >
          MDL
        </span>
        {suffix && (
          <span className="font-mono text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
        <span
          className={`ml-2 hidden font-mono text-[10px] md:inline ${
            negative ? "text-muted-foreground/40" : "text-muted-foreground/60"
          }`}
        >
          ≈ {priceEUR}€
        </span>
      </div>
    </div>
  );
}

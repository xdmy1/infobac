import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  Heart,
  Sparkles,
  Quote,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CtaFinal } from "@/components/marketing/cta-final";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Despre InfoBac — echipa din Chișinău pentru BAC informatică",
  description:
    "InfoBac e construit de elevi care au dat aceleași examene Certiport anul trecut. Misiunea: să facem BAC informatică accesibil pentru orice elev din Moldova.",
  alternates: {
    canonical: "/despre",
    languages: { "ro-MD": "/despre" },
  },
  openGraph: {
    title: "Despre InfoBac — făcut de elevi pentru elevi",
    description:
      "Echipa InfoBac.md din Chișinău. Misiunea: BAC informatică accesibil pentru toți elevii din Moldova.",
    url: `${siteConfig.url}/despre`,
    type: "website",
  },
};

const values = [
  {
    icon: Compass,
    title: "Programa exactă",
    description: `Nu adăugăm capitole „bonus" ca să arătăm că dăm mai mult. Învățăm doar ce verifică examenele Certiport — nimic mai mult, nimic mai puțin.`,
  },
  {
    icon: ShieldCheck,
    title: "Onestitate înainte de marketing",
    description:
      "Dacă nu ai timp serios de pus pe carte, îți spunem. Niciun upsell forțat.",
  },
  {
    icon: Heart,
    title: "Suport real, nu chatbot",
    description:
      "Întrebare la 23:30? Răspuns de la o persoană reală în câteva ore. Nu te lăsăm să te lupți singur.",
  },
  {
    icon: Sparkles,
    title: "Construim împreună",
    description: `Fiecare exercițiu a pornit de la „ce mi-ar fi plăcut să existe când treceam eu prin asta". Feedback-ul tău intră direct în următoarea iterație.`,
  },
];

const team = [
  {
    initials: "AP",
    name: "Andrei P.",
    role: "Fondator · Curriculum Python & SQL",
    bio: "A luat cele 3 certificări Certiport în clasa a 12-a, sesiunea iunie 2025. A construit primele simulări noaptea, pe Notion.",
    placeholder: false,
    accent: "bg-primary/15 text-primary",
  },
  {
    initials: "CN",
    name: "[În curând]",
    role: "Curriculum Networking · Mentor",
    bio: "Postul e încă deschis. Caut un absolvent recent al cursurilor IT Specialist, dispus să transforme experiența proprie într-un syllabus.",
    placeholder: true,
    accent: "bg-accent/30 text-foreground",
  },
  {
    initials: "RD",
    name: "[În curând]",
    role: "Suport elevi · Q&A live",
    bio: "Studentă/student la informatică sau matematică, cu răbdare și empatie. Gestionează emailul `hello@` și sesiunile săptămânale.",
    placeholder: true,
    accent: "bg-warning/15 text-foreground",
  },
];

export default function DesprePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          { name: "Despre noi", url: "/despre" },
        ]}
      />
      <DespreHero />

      {/* Manifesto — large editorial quote */}
      <section className="border-t border-border py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <Reveal variant="fade-up">
            <Quote
              className="size-12 text-accent/40"
              aria-hidden
              strokeWidth={1.5}
            />
          </Reveal>

          <Reveal
            staggerChildren={0.15}
            delay={0.1}
            className="mt-6 space-y-6 text-pretty text-xl leading-relaxed text-foreground md:text-2xl"
          >
            <RevealItem variant="fade-blur" as="p">
              Anul trecut, mulți colegi de-ai noștri au renunțat la ideea de „10
              din oficiu" pentru că opțiunile dominante costau{" "}
              <span className="font-semibold">~1.000 EUR</span> și se întindeau
              pe 10 luni.
            </RevealItem>
            <RevealItem variant="fade-blur" as="p">
              Noi am dat aceleași examene{" "}
              <span className="font-semibold">într-o săptămână</span>. Nu eram
              „geniali" — doar aveam acces la materialele potrivite și știam pe
              ce să nu pierdem timpul.
            </RevealItem>
            <RevealItem variant="fade-blur" as="p" className="text-muted-foreground">
              Diferența între „1.000 EUR și 10 luni" și „100 EUR și 6–10
              săptămâni" nu e talentul.{" "}
              <span className="text-foreground">E informația structurată corect.</span>
            </RevealItem>
            <RevealItem variant="fade-blur" as="p">
              Asta facem aici.
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* Values — 4 cards */}
      <section className="border-t border-border bg-muted/20 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <Reveal staggerChildren={0.12} className="mb-14 max-w-2xl md:mb-20">
            <RevealItem variant="fade-up">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Valori
              </p>
            </RevealItem>
            <RevealItem variant="fade-blur">
              <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Cum lucrăm.
              </h2>
            </RevealItem>
            <RevealItem variant="fade-up">
              <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                4 principii pe care le verificăm înainte de orice decizie de
                produs.
              </p>
            </RevealItem>
          </Reveal>

          <Reveal
            staggerChildren={0.1}
            amount={0.1}
            className="grid gap-5 sm:grid-cols-2 lg:gap-6"
            as="ul"
          >
            {values.map(({ icon: Icon, title, description }) => (
              <RevealItem key={title} variant="fade-up" as="li">
                <SpotlightCard
                  glowColor="color-mix(in oklab, var(--primary) 30%, transparent)"
                  className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30 md:p-7"
                >
                  <span
                    aria-hidden
                    className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  >
                    <Icon className="size-5" strokeWidth={2.25} />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm text-muted-foreground md:text-base">
                    {description}
                  </p>
                </SpotlightCard>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <Reveal staggerChildren={0.12} className="mb-14 max-w-2xl md:mb-20">
            <RevealItem variant="fade-up">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Echipa
              </p>
            </RevealItem>
            <RevealItem variant="fade-blur">
              <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Cine construiește.
              </h2>
            </RevealItem>
            <RevealItem variant="fade-up">
              <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                Echipă mică în creștere. Câteva poziții deschise.
              </p>
            </RevealItem>
          </Reveal>

          <Reveal
            staggerChildren={0.12}
            amount={0.05}
            className="grid gap-6 md:grid-cols-3"
            as="ul"
          >
            {team.map((m) => (
              <RevealItem key={m.initials} variant="fade-up" as="li">
                <div
                  className={cn(
                    "flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6",
                    m.placeholder && "border-dashed bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <Avatar className="size-12">
                      <AvatarFallback
                        className={cn(
                          "text-base font-semibold",
                          m.placeholder
                            ? "bg-muted text-muted-foreground"
                            : m.accent
                        )}
                      >
                        {m.placeholder ? "?" : m.initials}
                      </AvatarFallback>
                    </Avatar>
                    {m.placeholder && (
                      <Badge variant="outline" className="text-[10px]">
                        poziție deschisă
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-base font-semibold",
                        m.placeholder
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {m.name}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {m.role}
                    </p>
                  </div>
                  <p className="text-pretty text-sm text-muted-foreground">
                    {m.bio}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Reveal>

          <Reveal
            variant="fade-up"
            delay={0.4}
            className="mt-12 flex justify-center"
          >
            <Link
              href={`mailto:${siteConfig.contact.email}?subject=Aplicație%20pentru%20echipă`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 gap-2 px-5 text-sm"
              )}
            >
              Aplică pentru o poziție
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}

function DespreHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-12 md:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* TEXT — col-span-7 */}
        <div className="md:col-span-7">
          <Reveal staggerChildren={0.1}>
            <RevealItem variant="fade-up">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Despre noi
              </p>
            </RevealItem>
            <RevealItem variant="fade-blur">
              <h1 className="mt-4 text-balance text-5xl font-bold leading-[1] tracking-tight md:text-6xl lg:text-[5.5rem]">
                Făcut de elevi.
                <br />
                <span className="italic text-muted-foreground">Pentru elevi.</span>
              </h1>
            </RevealItem>
            <RevealItem variant="fade-up">
              <p className="mt-6 max-w-md text-pretty text-base text-muted-foreground md:text-lg">
                A început ca un caiet de notițe pentru prietenii noștri. Acum e
                o platformă pentru întreaga generație care vine după noi.
              </p>
            </RevealItem>
          </Reveal>
        </div>

        {/* STATS / FACTS — col-span-5 */}
        <div className="md:col-span-5">
          <Reveal staggerChildren={0.1} delay={0.3} className="space-y-1">
            <RevealItem variant="fade-up">
              <FactRow
                label="Fondat"
                value="2025"
                sub="după sesiunea iunie BAC"
              />
            </RevealItem>
            <RevealItem variant="fade-up">
              <FactRow label="Sediu" value="Chișinău, MD" sub="100% remote-first" />
            </RevealItem>
            <RevealItem variant="fade-up">
              <FactRow
                label="Generație fondatori"
                value="2007 / clasa 12"
                sub="absolvenți IT Specialist toate 3"
              />
            </RevealItem>
            <RevealItem variant="fade-up">
              <FactRow
                label="Misiune"
                value="Acces > preț"
                sub="democratizăm BAC informatică în MD"
              />
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FactRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-border py-4 first:border-t-0">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="text-right">
        <p className="font-bold tabular-nums">{value}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

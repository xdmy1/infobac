import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaFinal } from "@/components/marketing/cta-final";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { faqItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Întrebări frecvente",
  description:
    "Răspunsuri la întrebările frecvente despre InfoBac, certificările Certiport, BAC informatică Moldova, prețuri și pregătire.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  // Featured question = the most-clicked / first-impression: BAC equivalence
  const featured = faqItems[0];

  return (
    <>
      <FaqHero featured={featured} />
      <FaqSection />
      <CtaFinal />
    </>
  );
}

function FaqHero({ featured }: { featured: { q: string; a: string } }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24 lg:px-8 lg:py-28">
        <Reveal staggerChildren={0.1} className="max-w-3xl">
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              FAQ · 10 întrebări frecvente
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h1 className="mt-4 text-balance text-5xl font-bold leading-[1] tracking-tight md:text-6xl lg:text-[5.5rem]">
              Tot ce vrei{" "}
              <span className="italic text-muted-foreground">să știi</span>{" "}
              înainte.
            </h1>
          </RevealItem>
        </Reveal>

        {/* Featured Q — pull-quote style, large */}
        <Reveal variant="fade-up" delay={0.3} className="mt-16 md:mt-20">
          <div className="grid gap-4 border-t border-border pt-8 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                Cea mai pusă întrebare
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                #01 / 10
              </p>
            </div>
            <div className="md:col-span-9">
              <p className="text-balance text-2xl font-bold leading-snug tracking-tight md:text-3xl lg:text-4xl">
                {featured.q}
              </p>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {featured.a}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { faqItems } from "@/lib/content";
import { cn } from "@/lib/utils";

// Group the 10 FAQ items into editorial categories.
// Index map keeps content.ts clean — no schema change needed.
const groups: Array<{ label: string; eyebrow: string; indices: number[] }> = [
  {
    label: "Despre examene & BAC",
    eyebrow: "01",
    indices: [0, 1, 2, 3],
  },
  {
    label: "Pregătire & ritm",
    eyebrow: "02",
    indices: [4, 5, 7],
  },
  {
    label: "Plată & abonament",
    eyebrow: "03",
    indices: [6, 8, 9],
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* SIDEBAR — sticky heading + contact CTA */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Reveal staggerChildren={0.1}>
                <RevealItem variant="fade-up">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    FAQ · 10 întrebări
                  </p>
                </RevealItem>
                <RevealItem variant="fade-blur">
                  <h2 className="mt-3 text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                    Tot ce vrei{" "}
                    <span className="italic text-muted-foreground">să știi</span>{" "}
                    înainte.
                  </h2>
                </RevealItem>
                <RevealItem variant="fade-up">
                  <p className="mt-6 text-pretty text-base text-muted-foreground md:text-lg">
                    Întrebările care ne vin cel mai des — de la cum echivalează
                    BAC-ul, până la ce se întâmplă dacă nu treci un examen.
                  </p>
                </RevealItem>

                <RevealItem variant="fade-up">
                  <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6">
                    <p className="text-sm font-semibold tracking-tight">
                      Mai ai întrebări?
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Răspundem în câteva ore. Niciodată mai târziu de 12.
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
          </aside>

          {/* MAIN — categorized accordion */}
          <div className="lg:col-span-7">
            <Reveal staggerChildren={0.08} className="space-y-12">
              {groups.map((group, gi) => (
                <RevealItem key={group.label} variant="fade-up">
                  <CategoryGroup
                    eyebrow={group.eyebrow}
                    label={group.label}
                    items={group.indices.map((i) => faqItems[i])}
                    groupId={gi}
                  />
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGroup({
  eyebrow,
  label,
  items,
  groupId,
}: {
  eyebrow: string;
  label: string;
  items: Array<{ q: string; a: string }>;
  groupId: number;
}) {
  return (
    <div>
      <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-4">
        <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
          {eyebrow}
        </span>
        <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
          {label}
        </h3>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {items.length} întrebări
        </span>
      </div>

      <Accordion multiple={false} className="flex flex-col">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`g${groupId}-${i}`}
            className={cn(
              "border-b-0 border-t border-border/60 first:border-t-0"
            )}
          >
            <AccordionTrigger className="px-1 py-5 text-base font-semibold md:text-lg">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-5 text-pretty text-sm text-muted-foreground md:text-base">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

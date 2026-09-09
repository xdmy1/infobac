import { ArrowRight, CreditCard, Sparkles } from "lucide-react";
import { TrackedLink } from "@/components/shared/tracked-link";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { freeTrial } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The full offer block, for the page where someone is comparing prices.
 *
 * The thin bar above the navbar is a reminder; this is the answer to the
 * objection the plan cards raise. It sits directly under them because that is
 * the moment the price lands, and it leads with the card promise rather than
 * with the seven days — "how much" is the question being asked.
 *
 * Purely presentational, like the bar above the navbar: the page decides
 * whether this person still has an offer to take.
 */
export function TrialBanner() {
  return (
    <section className="border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal staggerChildren={0.08}>
          <RevealItem variant="fade-up">
            <div className="overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-8">
                <div className="min-w-0 max-w-xl">
                  <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    <Sparkles className="size-3.5" />
                    Fără card
                  </p>

                  <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight md:text-3xl">
                    Nu ești sigur? Ia {freeTrial.days} zile gratis, întâi.
                  </h2>

                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                    Alegi un modul și intri acum. Toate lecțiile, quiz-urile și
                    simulările lui, timp de {freeTrial.days} zile. Nu se cere
                    card nici la început, nici la final. Testezi, atingi, apoi
                    dacă îți place cumperi.
                  </p>

                  <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                    <CreditCard className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
                    <span>
                      Nu există reînnoire automată de oprit. După{" "}
                      {freeTrial.days} zile accesul se oprește singur. Ofertă
                      până pe 15 septembrie.
                    </span>
                  </p>
                </div>

                <TrackedLink
                  href="/incearca-gratis"
                  event="trial_cta_clicked"
                  properties={{ location: "pricing_page" }}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-12 shrink-0 gap-2 px-6 text-sm font-semibold",
                  )}
                >
                  Începe cele {freeTrial.days} zile
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </TrackedLink>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

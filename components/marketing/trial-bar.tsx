import { ArrowRight, Sparkles } from "lucide-react";
import { TrackedLink } from "@/components/shared/tracked-link";
import { freeTrial } from "@/lib/content";

/**
 * The thin offer strip that sits above the navbar.
 *
 * Purely presentational: the layout decides whether to render it, because
 * "should this person see the offer" needs the session and a database read.
 * Someone mid-trial, someone who already used it and someone who has paid all
 * get nothing here.
 */
export function TrialBar() {
  return (
    <div className="w-full border-b border-primary/20 bg-primary/10">
      <TrackedLink
        href="/incearca-gratis"
        event="trial_cta_clicked"
        properties={{ location: "top_bar" }}
        className="group mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-2 text-[13px] leading-tight md:px-6 lg:px-8"
      >
        <Sparkles className="size-3.5 shrink-0 text-primary" />
        <span className="font-semibold text-foreground">
          {freeTrial.days} zile gratis
        </span>

        {/* Kept as its own mark instead of folded into the sentence: it is the
            objection being answered, so it survives every breakpoint while the
            explaining half below is dropped on a narrow screen. */}
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          fără card
        </span>

        <span className="hidden text-muted-foreground sm:inline">
          Testezi tot, apoi decizi. Ofertă până pe 15 septembrie.
        </span>

        <span className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 group-hover:underline">
          {freeTrial.barCta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </TrackedLink>
    </div>
  );
}

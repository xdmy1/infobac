import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { freeTrial } from "@/lib/content";
import type { TrialStatus } from "@/lib/queries/trial";
import { cn } from "@/lib/utils";

/**
 * The free-trial offer on /abonament.
 *
 * Only the "not taken yet" state lives here. A running trial is the student's
 * current access, so it belongs to SubscriptionStatusCard at the top of the
 * page — saying it twice on one screen is noise. A lapsed trial says nothing
 * at all: the plans below are the answer to that, and repeating "you used it
 * up" on the billing page is only nagging.
 */
export function TrialCard({ status }: { status: TrialStatus }) {
  if (!status.offerOpen || !status.eligible) return null;

  return (
    <section className="rounded-2xl border border-primary/40 bg-primary/5 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold">
              {freeTrial.days} zile gratis, fără card
            </p>
            <p className="text-sm text-muted-foreground">
              Alegi un modul și intri acum. Testezi tot, apoi decizi. Ofertă
              până pe 15 septembrie.
            </p>
          </div>
        </div>
        <Link
          href="/incearca-gratis"
          className={cn(buttonVariants(), "h-10 gap-1.5 px-4 text-sm font-medium")}
        >
          Începe gratis
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

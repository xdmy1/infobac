import Link from "next/link";
import { ArrowRight, CalendarClock, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { freeTrial } from "@/lib/content";
import type { TrialStatus } from "@/lib/queries/trial";
import { cn } from "@/lib/utils";

/**
 * The free-trial block on /abonament.
 *
 * Two states are worth a card and nothing else is: the offer is open and the
 * student has not taken it, or their week is running and they need to see how
 * much of it is left. A trial that has already lapsed says nothing here — the
 * plans below are the answer to that, and repeating "you used it up" on the
 * billing page would only be nagging.
 */
export function TrialCard({ status }: { status: TrialStatus }) {
  if (status.isRunning) {
    const days = status.daysLeft;
    return (
      <section className="rounded-2xl border border-primary/40 bg-primary/5 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CalendarClock className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-base font-semibold">
                Perioadă de probă activă — {days}{" "}
                {days === 1 ? "zi rămasă" : "zile rămase"}
              </p>
              <p className="text-sm text-muted-foreground">
                Fără card și fără reînnoire. Când se termină, accesul se oprește
                singur și alegi tu dacă vrei un plan.
              </p>
            </div>
          </div>
          <Link
            href="/preturi"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-1.5 px-4 text-sm font-medium",
            )}
          >
            Vezi planurile
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    );
  }

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

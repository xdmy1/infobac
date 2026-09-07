"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Settings2, X, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  cancelSubscriptionAction,
  openBillingPortalAction,
} from "@/lib/actions/checkout";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ro-MD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Self-service subscription controls: cancel in one click (with a single
 * confirm step) and a link to the provider portal for card/invoices. Creem
 * requires cancellation to live inside the product.
 *
 * The cancel button only appears when there is something to cancel — offering
 * it to an account with no live plan (or one already cancelled) produced an
 * error toast and left the student guessing about the real state.
 */
export function SubscriptionManager({
  canceled = false,
  hasSubscription = false,
}: {
  /** The live plan is already cancelled — no more renewals. */
  canceled?: boolean;
  /** There is a live plan at all (cancelled or not). */
  hasSubscription?: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isCancelling, startCancel] = useTransition();
  const [isOpening, startPortal] = useTransition();

  const openPortal = () =>
    startPortal(async () => {
      try {
        const r = await openBillingPortalAction();
        if (!r.ok) {
          toast.error(r.error);
          return;
        }
        window.location.assign(r.url);
      } catch {
        toast.error("Nu am putut deschide portalul. Reîncearcă.");
      }
    });

  const cancel = () =>
    startCancel(async () => {
      try {
        const r = await cancelSubscriptionAction();
        if (!r.ok) {
          toast.error(r.error);
          setConfirming(false);
          return;
        }
        const until = formatDate(r.endsAt);
        toast.success(
          r.alreadyCanceled
            ? "Abonamentul era deja anulat la procesator — acum e marcat corect și aici."
            : until
              ? `Abonament anulat. Accesul rămâne activ până la ${until}.`
              : "Abonament anulat. Accesul rămâne activ până la finalul perioadei plătite.",
        );
        setConfirming(false);
        // revalidatePath() only marks the cache stale; without this the page
        // the student is looking at keeps showing the pre-cancel state.
        router.refresh();
      } catch {
        toast.error("Anularea nu a reușit. Reîncearcă.");
      }
    });

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={openPortal}
        disabled={isOpening}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-10 gap-2 text-sm font-medium",
          isOpening && "cursor-wait",
        )}
      >
        {isOpening ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Settings2 className="size-4" />
        )}
        Card și facturi
        <ExternalLink className="size-3.5 opacity-60" />
      </button>

      {hasSubscription &&
        !canceled &&
        (confirming ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancel}
              disabled={isCancelling}
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "h-10 gap-2 text-sm font-semibold",
                isCancelling && "cursor-wait",
              )}
            >
              {isCancelling ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              Sigur anulează
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isCancelling}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Renunț
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-destructive"
          >
            Anulează abonamentul
          </button>
        ))}
    </div>
  );
}

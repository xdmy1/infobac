"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink, Settings2, X, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  cancelSubscriptionAction,
  openBillingPortalAction,
} from "@/lib/actions/checkout";

/**
 * Self-service subscription controls: cancel in one click (with a single
 * confirm step) and a link to the provider portal for card/invoices. Creem
 * requires cancellation to live inside the product.
 */
export function SubscriptionManager({
  canceled = false,
}: {
  canceled?: boolean;
}) {
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
        toast.success(
          "Abonament anulat. Accesul rămâne activ până la finalul perioadei plătite.",
        );
        setConfirming(false);
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

      {!canceled &&
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

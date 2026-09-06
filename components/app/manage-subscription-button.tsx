"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink, Settings2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openBillingPortalAction } from "@/lib/actions/checkout";

/**
 * Opens Creem's customer portal — cancel, change card, download invoices.
 *
 * Creem requires cancellation to be reachable from inside the product, so this
 * button is a compliance requirement, not just convenience.
 */
export function ManageSubscriptionButton({
  className,
}: {
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            // Redirects on success, so a returned value always means failure.
            const result = await openBillingPortalAction();
            if (result && !result.ok) toast.error(result.error);
          } catch (err) {
            console.warn("[billing] portal open failed:", err);
            toast.error("Nu am putut deschide portalul. Reîncearcă.");
          }
        })
      }
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-10 gap-2 text-sm font-medium",
        isPending && "cursor-wait",
        className,
      )}
    >
      <Settings2 className="size-4" />
      {isPending ? "Se deschide…" : "Gestionează abonamentul"}
      <ExternalLink className="size-3.5 opacity-60" />
    </button>
  );
}

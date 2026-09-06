"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteAccountAction } from "@/lib/actions/account";

/**
 * Deletes the account after a single explicit confirm. The action cancels any
 * active subscription first, so nobody keeps paying for an account that no
 * longer exists.
 */
export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      try {
        const r = await deleteAccountAction();
        // On success the action redirects; only a failure returns here.
        if (r && !r.ok) {
          toast.error(r.error);
          setConfirming(false);
        }
      } catch (err) {
        // A redirect throws NEXT_REDIRECT — let it navigate, don't toast.
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
        ) {
          throw err;
        }
        toast.error("Nu am putut șterge contul. Reîncearcă.");
      }
    });

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-destructive underline underline-offset-4 hover:opacity-80"
      >
        Șterge contul
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground">
        Sigur? Se șterge definitiv contul, progresul și accesul. Dacă ai un
        abonament activ, îl anulăm automat înainte. Acțiunea nu poate fi
        anulată.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "destructive" }),
            "h-10 gap-2 text-sm font-semibold",
            isPending && "cursor-wait",
          )}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Da, șterge definitiv
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Renunț
        </button>
      </div>
    </div>
  );
}

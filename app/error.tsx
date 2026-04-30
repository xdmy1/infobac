"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, AlertTriangle, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporter in production (Sentry etc).
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <span
        aria-hidden
        className="mb-6 inline-flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive"
      >
        <AlertTriangle className="size-6" />
      </span>

      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Ceva nu a mers
      </p>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
        S-a întâmplat o eroare neașteptată.
      </h1>
      <p className="mt-4 text-pretty text-sm text-muted-foreground md:text-base">
        Echipa noastră a fost notificată. Încearcă să reîncarci pagina —
        adesea e suficient.
      </p>

      {error.digest && (
        <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
          ID eroare: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className={cn(
            buttonVariants(),
            "h-11 gap-2 px-5 text-sm font-medium"
          )}
        >
          <RotateCw className="size-4" />
          Reîncearcă
        </button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 gap-2 px-5 text-sm font-medium"
          )}
        >
          <Home className="size-4" />
          Pagina principală
        </Link>
      </div>
    </div>
  );
}

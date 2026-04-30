"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, AlertTriangle, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center md:py-24">
      <span
        aria-hidden
        className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive"
      >
        <AlertTriangle className="size-5" />
      </span>
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Eroare
      </p>
      <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight md:text-3xl">
        Nu am putut încărca pagina.
      </h1>
      <p className="mt-3 text-pretty text-sm text-muted-foreground">
        Posibil să fie o problemă temporară de conexiune sau pe partea
        noastră. Încearcă să reîncarci.
      </p>

      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">
          ID: {error.digest}
        </p>
      )}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className={cn(
            buttonVariants(),
            "h-10 gap-2 px-5 text-sm font-medium"
          )}
        >
          <RotateCw className="size-4" />
          Reîncearcă
        </button>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 gap-2 px-5 text-sm font-medium"
          )}
        >
          <Home className="size-4" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "404 — pagina nu există",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="bg-dot-grid mask-fade-edges pointer-events-none absolute inset-0 -z-10 opacity-30"
      />
      <div
        aria-hidden
        className="gradient-radial-primary pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
      />

      <Logo height={32} className="mb-12" priority />

      <div className="max-w-lg text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Eroare 404
        </p>
        <h1 className="mt-2 text-balance text-5xl font-bold tracking-tight md:text-6xl">
          Pagina asta nu există.
        </h1>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">
          Sau a existat și am mutat-o. Sau ai scris greșit URL-ul.{" "}
          <span className="text-foreground">Întoarce-te de unde ai venit</span>{" "}
          sau pornește de la pagina principală.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "h-11 gap-2 px-5 text-sm font-medium"
            )}
          >
            <Home className="size-4" />
            Pagina principală
          </Link>
          <Link
            href="/cursuri"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 px-5 text-sm font-medium"
            )}
          >
            <Search className="size-4" />
            Vezi cursurile
          </Link>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Crezi că e o eroare?{" "}
          <a
            href="mailto:hello@infobac.md?subject=404%20pagina%20rupt%C4%83"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Anunță-ne
          </a>
          .
        </p>
      </div>
    </div>
  );
}

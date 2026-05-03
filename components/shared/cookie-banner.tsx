"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cookie-consent";

type ConsentValue = "accepted" | "rejected";
type ConsentState = "unknown" | ConsentValue;

// Minimal typing for the gtag bridge installed by app/layout.tsx.
// Avoids `any` while staying compatible with Google Consent Mode v2 calls.
type GtagFn = (
  command: "consent",
  action: "default" | "update",
  params: Record<string, string | number>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    // `dataLayer` is also declared by `@next/third-parties` (typed as
    // `Object[]`); we only read/write through `gtag` here so we don't
    // re-declare it and risk a "must have the same type" merge error.
  }
}

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>("unknown");

  useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "rejected") {
      setConsent(v);
    }
  }, []);

  function decide(value: ConsentValue) {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: value === "accepted" ? "granted" : "denied",
      });
    }

    // Let other parts of the app react if needed (no listeners today, but cheap
    // to emit and avoids a future refactor when we add a settings toggle).
    window.dispatchEvent(
      new CustomEvent("cookie-consent-change", { detail: value }),
    );
  }

  if (consent !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consimțământ cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:py-5 lg:px-8">
        <div className="text-sm text-foreground">
          <p className="font-semibold">Folosim cookies</p>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Folosim Google Analytics ca să vedem ce funcționează pe site.
            Datele sunt anonimizate. Refuzul nu afectează nimic — funcționează
            identic.{" "}
            <Link
              href="/legal/confidentialitate"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Politica noastră de confidențialitate
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2 md:flex-col md:gap-2 lg:flex-row">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-9 flex-1 px-4 text-xs md:flex-none",
            )}
          >
            Doar esențiale
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-9 flex-1 px-4 text-xs md:flex-none",
            )}
          >
            Accept analitice
          </button>
        </div>
      </div>
    </div>
  );
}

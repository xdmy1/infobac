"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cookie-notice";

/**
 * Informational notice about measurement.
 *
 * It is a notice, not a gate: analytics runs for every visitor and the banner
 * says so, with the opt-out one click away in the privacy policy. The previous
 * version asked for consent up front and defaulted to denied, which meant
 * everyone who ignored it was invisible — most of the audience, and the whole
 * reason there was no picture of what people actually do here.
 */
export function CookieBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Starts dismissed so the notice never flashes for someone who has already
    // read it, then appears only if they have not.
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "seen");
    } catch {
      setDismissed(false);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "seen");
    } catch {
      /* private mode — it will show again, which is harmless */
    }
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notă despre măsurarea traficului"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:py-5 lg:px-8">
        <div className="text-sm text-foreground">
          <p className="font-semibold">Măsurăm cum e folosit site-ul</p>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Ca să înțelegem ce funcționează, înregistrăm paginile vizitate,
            de unde ai venit și cum navighezi prin site. Nu colectăm ce
            scrii în formulare — câmpurile sunt ascunse înainte să plece din
            browser. Poți opri măsurarea oricând din{" "}
            <Link
              href="/legal/confidentialitate#analitice"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              politica de confidențialitate
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={dismiss}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-9 flex-1 px-4 text-xs md:flex-none",
            )}
          >
            Am înțeles
          </button>
        </div>
      </div>
    </div>
  );
}

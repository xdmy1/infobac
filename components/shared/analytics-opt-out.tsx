"use client";

import { useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "analytics-opt-out";

// localStorage is an external store, so it is read through the hook meant for
// external stores rather than mirrored into state from an effect. That also
// keeps the two tabs of one browser in agreement.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Nothing is known during the server render — the preference lives in the browser. */
function getServerSnapshot(): null {
  return null;
}

/**
 * Lets a reader switch measurement off for this browser, from the page that
 * explains what is measured.
 *
 * The flag is read by both analytics bootstraps on the next load — PostHog in
 * instrumentation-client.ts and Google Consent Mode in app/layout.tsx — and
 * PostHog is stopped immediately here, without waiting for a reload.
 */
export function AnalyticsOptOut() {
  const optedOut = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function toggle() {
    const next = !optedOut;
    try {
      if (next) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode — the SDK call below still applies for this session */
    }
    try {
      if (next) posthog.opt_out_capturing();
      else posthog.opt_in_capturing();
    } catch {
      /* analytics not configured */
    }
    for (const notify of listeners) notify();
  }

  // Nothing until the stored preference is known, so the label never flips.
  if (optedOut === null) return null;

  return (
    <div className="not-prose my-6 rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold">
        {optedOut
          ? "Măsurarea e oprită pe acest dispozitiv."
          : "Măsurarea e activă pe acest dispozitiv."}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {optedOut
          ? "Nu înregistrăm ce pagini vizitezi din acest browser. Setarea e salvată local, deci se aplică doar aici."
          : "Poți opri asta oricând. Setarea se salvează în acest browser și nu afectează contul sau accesul la cursuri."}
      </p>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          buttonVariants({ variant: optedOut ? "default" : "outline" }),
          "mt-4 h-10 px-4 text-sm font-medium",
        )}
      >
        {optedOut ? "Repornește măsurarea" : "Oprește măsurarea"}
      </button>
    </div>
  );
}

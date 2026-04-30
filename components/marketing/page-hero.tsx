"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { NoiseOverlay } from "@/components/shared/noise-overlay";

const AuroraBackground = dynamic(
  () =>
    import("@/components/shared/aurora-bg").then((m) => m.AuroraBackground),
  { ssr: false }
);

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  /** Aurora intensity (0..1). Default 0.4 — keep heroes subdued vs main hero. */
  intensity?: number;
}

/**
 * Standard hero used on every marketing sub-page (/preturi, /cursuri, etc.).
 * Lighter aurora than the main homepage hero to maintain hierarchy.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  intensity = 0.35,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <AuroraBackground intensity={intensity} />
      </div>
      <NoiseOverlay opacity={0.04} />
      <div
        aria-hidden
        className="bg-dot-grid mask-fade-edges pointer-events-none absolute inset-0 -z-10 opacity-20"
      />

      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-24 lg:px-8 lg:py-28">
        <Reveal staggerChildren={0.12}>
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </RevealItem>
          <RevealItem variant="fade-up">
            <div className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">
              {description}
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

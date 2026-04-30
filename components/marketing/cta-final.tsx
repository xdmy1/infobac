"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { NoiseOverlay } from "@/components/shared/noise-overlay";
import { AuroraBackground } from "@/components/shared/aurora-bg";
import { cn } from "@/lib/utils";

export function CtaFinal() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <AuroraBackground intensity={0.5} />
      </div>
      <NoiseOverlay opacity={0.04} />
      <div
        aria-hidden
        className="bg-dot-grid mask-fade-edges pointer-events-none absolute inset-0 -z-10 opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent"
      />

      <div className="mx-auto max-w-4xl px-4 py-28 text-center md:px-6 md:py-36 lg:px-8 lg:py-44">
        <Reveal staggerChildren={0.18}>
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Începe acum
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Fă primul pas.
              <br />
              <span className="bg-gradient-to-br from-accent via-accent to-accent-hover bg-clip-text text-transparent">
                De la 250 MDL/lună.
              </span>
            </h2>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              Alege un modul, toate 3 sau pachetul de 6 luni. Anulezi oricând la
              planurile lunare. Singura miză:{" "}
              <span className="font-semibold text-foreground">10 din oficiu</span>.
            </p>
          </RevealItem>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col items-center gap-5"
        >
          <Link
            href="/preturi"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group relative h-14 gap-2 overflow-hidden px-8 text-base font-bold shadow-2xl shadow-primary/30",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:via-primary-hover before:to-primary before:bg-[length:200%_100%] before:bg-left",
              "before:transition-[background-position] before:duration-700 hover:before:bg-right"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Alege un plan
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-success" />
            Date protejate · Anulezi oricând · 60 secunde să te înscrii
          </p>
        </motion.div>
      </div>
    </section>
  );
}

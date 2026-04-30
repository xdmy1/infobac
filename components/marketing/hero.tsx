"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ArrowDown, CheckCircle2, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NoiseOverlay } from "@/components/shared/noise-overlay";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { AnimatedText } from "@/components/shared/animated-text";
import { AuroraBackground } from "@/components/shared/aurora-bg";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import { heroTrustIndicators } from "@/lib/content";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax — mockup floats up slowly as we scroll.
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <AuroraBackground intensity={0.7} />
      </div>
      <NoiseOverlay opacity={0.05} />

      <div
        aria-hidden
        className="bg-dot-grid mask-fade-edges pointer-events-none absolute inset-0 -z-10 opacity-25"
      />

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-28 md:px-6 md:pt-24 md:pb-32 lg:px-8 lg:pt-32 lg:pb-40">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col items-start gap-7 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-border bg-background/40 px-3 py-1.5 text-xs font-medium backdrop-blur"
              >
                <MapPin className="size-3" strokeWidth={2.25} />
                Făcut în Chișinău de elevi care au luat 10
              </Badge>
            </motion.div>

            <h1
              className="text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl"
            >
              <AnimatedText
                text="10 din oficiu la BAC informatică."
                as="span"
                stagger={0.06}
                duration={0.9}
                className="block"
                decorate={{
                  0: (w) => (
                    <span
                      className="inline-block bg-gradient-to-br from-accent to-accent-hover bg-clip-text text-transparent"
                      style={{ backgroundClip: "text", WebkitBackgroundClip: "text" }}
                    >
                      {w}
                    </span>
                  ),
                }}
              />
              <AnimatedText
                text="Fără să dai 1.000 EUR."
                as="span"
                stagger={0.06}
                duration={0.9}
                delay={0.4}
                className="mt-2 block text-muted-foreground"
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl"
            >
              Platforma online cu programa exactă pentru certificările
              Certiport. Construită de elevi care au trecut prin asta — unii
              au luat toate 3 certificările într-o săptămână.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/inregistrare"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-13 gap-2 px-7 text-base font-semibold shadow-lg shadow-primary/25",
                  "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary before:to-primary-hover before:opacity-0 before:transition-opacity hover:before:opacity-100",
                  "relative overflow-hidden"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Vezi prețuri
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="#pathway"
                className={cn(
                  buttonVariants({ size: "lg", variant: "ghost" }),
                  "h-13 gap-2 px-7 text-base font-medium"
                )}
              >
                Vezi cum funcționează
                <ArrowDown className="size-4 animate-pulse-slow" />
              </Link>
            </motion.div>

            <Reveal
              staggerChildren={0.08}
              delay={1.6}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground"
            >
              {heroTrustIndicators.map((item) => (
                <RevealItem
                  key={item}
                  variant="fade-up"
                  className="inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="size-4 text-success" />
                  {item}
                </RevealItem>
              ))}
            </Reveal>
          </div>

          <motion.div
            style={{ y: mockupY, scale: mockupScale, opacity: mockupOpacity }}
            initial={{ opacity: 0, x: 40, filter: "blur(20px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:col-span-5 lg:block"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl"
      />

      <motion.div
        whileHover={{ scale: 1.02, rotateY: -2, rotateX: 2 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        style={{
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
        className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-foreground/10"
      >
        <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/40 px-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-yellow-400/80" />
            <span className="size-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-background/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            infobac.md/dashboard
          </div>
        </div>

        <div className="grid grid-cols-12">
          <aside className="col-span-4 border-r border-border bg-muted/20 p-3">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="text-base font-black leading-none text-accent">
                &gt;
              </span>
              <span className="text-xs font-bold tracking-tight">infobac</span>
            </div>
            <nav className="space-y-1">
              <SidebarItem label="Dashboard" active />
              <SidebarItem label="Cursurile mele" />
              <SidebarItem label="Progres" />
              <SidebarItem label="Simulări" />
              <SidebarItem label="Setări" />
            </nav>
          </aside>

          <div className="col-span-8 p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-xs font-semibold tracking-tight">
                Progresul tău
              </h3>
              <span className="text-[10px] text-muted-foreground">
                Sesiunea iunie
              </span>
            </div>
            <div className="space-y-3">
              <ProgressRow
                slug="python"
                label="Python"
                percent={87}
                barClass="bg-primary"
                delay={0}
              />
              <ProgressRow
                slug="sql"
                label="SQL"
                percent={64}
                barClass="bg-accent"
                delay={0.15}
              />
              <ProgressRow
                slug="networking"
                label="Networking"
                percent={12}
                barClass="bg-warning"
                delay={0.3}
              />
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background/40 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-success">
                <CheckCircle2 className="size-3" />
                Următor: simulare Python
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Estimat 50 min · 40 întrebări
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SidebarItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md px-2 py-1.5 text-[11px] font-medium",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </div>
  );
}

function ProgressRow({
  slug,
  label,
  percent,
  barClass,
  delay,
}: {
  slug: string;
  label: string;
  percent: number;
  barClass: string;
  delay: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <CourseIcon slug={slug} size={14} alt="" />
          {label}
        </span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {percent}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{
            duration: 1.4,
            delay: 1.5 + delay,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        />
      </div>
    </div>
  );
}

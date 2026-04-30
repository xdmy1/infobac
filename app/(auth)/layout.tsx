"use client";

import { motion } from "motion/react";
import { NoiseOverlay } from "@/components/shared/noise-overlay";
import { AuroraBackground } from "@/components/shared/aurora-bg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <AuroraBackground intensity={0.6} />
      </div>
      <NoiseOverlay opacity={0.05} />
      <div
        aria-hidden
        className="bg-dot-grid mask-fade-edges pointer-events-none absolute inset-0 -z-10 opacity-25"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(16px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.9,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

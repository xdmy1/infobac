"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Color of the cursor-following spotlight. */
  glowColor?: string;
  /** Spotlight diameter in pixels. */
  size?: number;
}

/**
 * Card that reveals a soft glow following the cursor on hover.
 * Implementation: a single radial-gradient overlay whose center coordinates
 * are bound to motion values via `useMotionTemplate` for native 60fps.
 */
export function SpotlightCard({
  children,
  className,
  glowColor = "color-mix(in oklab, var(--primary) 35%, transparent)",
  size = 320,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const opacity = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${glowColor}, transparent 70%)`;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => opacity.set(1)}
      onMouseLeave={() => opacity.set(0)}
      className={cn("group relative overflow-hidden", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 transition-opacity duration-300"
        style={{ background, opacity }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

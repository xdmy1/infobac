"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const SIZE = 480;

/**
 * A soft radial glow that follows the cursor — desktop only.
 * Disabled on touch devices and when prefers-reduced-motion.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const xs = useSpring(x, { damping: 28, stiffness: 200, mass: 1 });
  const ys = useSpring(y, { damping: 28, stiffness: 200, mass: 1 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reduce) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 mix-blend-soft-light"
      style={{
        x: xs,
        y: ys,
        width: SIZE,
        height: SIZE,
        background:
          "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 35%, transparent) 0%, transparent 65%)",
        filter: "blur(40px)",
      }}
    />
  );
}

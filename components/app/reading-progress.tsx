"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Top-of-page reading progress bar — fills smoothly as the user scrolls
 * down the lesson body. Position: fixed top so it's always visible.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
      style={{ scaleX }}
    />
  );
}

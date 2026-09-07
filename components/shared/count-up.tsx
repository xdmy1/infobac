"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useIsomorphicLayoutEffect,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

interface CountUpProps {
  to: number;
  /** Decimals to display. */
  decimals?: number;
  /** Suffix appended (e.g. "%", " MDL"). */
  suffix?: string;
  /** Prefix prepended. */
  prefix?: string;
  /** Animation duration in seconds — soft hint, the spring decides. */
  duration?: number;
  className?: string;
}

/**
 * Counts up to `to` when scrolled into view, using a damped spring.
 *
 * The final value is what gets rendered on the server and what stays on
 * screen if the count never runs — no JS, reduced motion, or an element the
 * IntersectionObserver never reports. A counter must never be readable as a
 * literal `0`: crawlers, screenshots and compliance scanners see the markup,
 * not the animation.
 */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
    mass: 1,
  });
  const [display, setDisplay] = useState(() => to.toFixed(decimals));
  const [running, setRunning] = useState(false);

  // Drop to the start value and kick off the spring in the same pre-paint
  // commit, so the swap from final value to 0 is never painted.
  useIsomorphicLayoutEffect(() => {
    if (!inView || prefersReducedMotion) return;
    setRunning(true);
    setDisplay((0).toFixed(decimals));
    motionValue.set(to);
  }, [inView, prefersReducedMotion, to, decimals, motionValue]);

  useEffect(() => {
    if (!running) return;
    return spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
  }, [running, spring, decimals]);

  // Suppress unused duration warning — spring uses its own physics.
  void duration;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

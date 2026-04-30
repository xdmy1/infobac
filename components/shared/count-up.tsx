"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

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
 * Animates a number from 0 to `to` when scrolled into view.
 * Uses a damped spring so the count settles naturally.
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
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
    mass: 1,
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionValue.set(to);
  }, [inView, to, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
  }, [spring, decimals]);

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

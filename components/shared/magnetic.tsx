"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "motion/react";
import { useRef, type ReactNode, type CSSProperties } from "react";

interface MagneticProps {
  children: ReactNode;
  /** 0 = no magnetism, 1 = follows cursor 1:1. Realistic 0.2-0.4. */
  strength?: number;
  /** Bigger value = looser spring. */
  damping?: number;
  className?: string;
  style?: CSSProperties;
}

const springConfig: SpringOptions = {
  damping: 16,
  stiffness: 220,
  mass: 0.6,
};

/**
 * Wraps children with a subtle magnetic effect — the element shifts
 * toward the cursor when hovered, and snaps back when the pointer leaves.
 * Great for hero CTAs.
 */
export function Magnetic({
  children,
  strength = 0.32,
  damping,
  className,
  style,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const config = damping ? { ...springConfig, damping } : springConfig;
  const xSpring = useSpring(x, config);
  const ySpring = useSpring(y, config);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: xSpring, y: ySpring, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

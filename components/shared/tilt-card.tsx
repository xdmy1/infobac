"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  maxTilt?: number;
}

/**
 * Card with subtle 3D tilt that follows the cursor.
 * Adds a soft perspective without making the layout feel like a toy.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotX = useTransform(my, [0, 1], [maxTilt, -maxTilt]);
  const rotY = useTransform(mx, [0, 1], [-maxTilt, maxTilt]);

  const rotXSpring = useSpring(rotX, { damping: 22, stiffness: 220 });
  const rotYSpring = useSpring(rotY, { damping: 22, stiffness: 220 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: rotXSpring,
        rotateY: rotYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}

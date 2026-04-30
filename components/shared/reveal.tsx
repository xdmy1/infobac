"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode, type CSSProperties } from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-blur"
  | "fade-in"
  | "scale-in"
  | "slide-right";

const variantsMap: Record<RevealVariant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-blur": {
    hidden: { opacity: 0, filter: "blur(16px)", y: 12 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
};

type RevealTag = "div" | "section" | "article" | "ul" | "ol" | "li" | "p" | "span" | "header" | "footer";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  /**
   * How much of the element must be visible to trigger.
   *  - `"some"` (default): any pixel visible. Robust for tall elements
   *    (lesson bodies, long markdown) where a percentage threshold like
   *    `0.3` would never be met because the element is taller than the
   *    viewport.
   *  - `"all"`: entire element in view.
   *  - `0..1`: fraction of the element visible.
   */
  amount?: number | "some" | "all";
  /** Stagger reveal of direct children when set. */
  staggerChildren?: number;
  className?: string;
  as?: RevealTag;
  style?: CSSProperties;
  once?: boolean;
}

const easeOutQuart = [0.21, 0.47, 0.32, 0.98] as const;

const motionMap = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  header: motion.header,
  footer: motion.footer,
} as const;

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  amount = "some",
  staggerChildren,
  className,
  as = "div",
  style,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const MotionTag = motionMap[as];

  const containerVariants: Variants = staggerChildren
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }
    : variantsMap[variant];

  return (
    <MotionTag
      ref={ref as never}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      transition={
        staggerChildren
          ? undefined
          : { duration, delay, ease: easeOutQuart }
      }
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

interface RevealItemProps {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
  as?: RevealTag;
  style?: CSSProperties;
}

/** Use as direct child of <Reveal staggerChildren=...> */
export function RevealItem({
  children,
  variant = "fade-up",
  duration = 0.7,
  className,
  as = "div",
  style,
}: RevealItemProps) {
  const MotionTag = motionMap[as];
  return (
    <MotionTag
      variants={variantsMap[variant]}
      transition={{ duration, ease: easeOutQuart }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

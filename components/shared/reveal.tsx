"use client";

import {
  motion,
  useInView,
  useIsomorphicLayoutEffect,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useRef, useState, type ReactNode, type CSSProperties } from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-blur"
  | "fade-in"
  | "scale-in"
  | "slide-right";

/**
 * `hidden` carries `duration: 0`. It is only ever entered in the pre-paint
 * commit right after mount (see `useRevealAnimation`), so it must snap —
 * animating *into* it would fade the content out in front of the reader.
 */
const snap = { duration: 0 } as const;

const variantsMap: Record<RevealVariant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 28, transition: snap },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -16, transition: snap },
    visible: { opacity: 1, y: 0 },
  },
  "fade-blur": {
    hidden: { opacity: 0, filter: "blur(16px)", y: 12, transition: snap },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0, transition: snap },
    visible: { opacity: 1 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.94, transition: snap },
    visible: { opacity: 1, scale: 1 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -28, transition: snap },
    visible: { opacity: 1, x: 0 },
  },
};

/**
 * Whether this render may hide content in order to animate it in.
 *
 * Always false on the server and through hydration, so the markup ships
 * *visible*: a reader without JavaScript, a crawler, and a screenshot taken
 * before the observers fire all get the content rather than an empty page.
 * That is not a hypothetical — a payment provider reviewing the pricing page
 * saw exactly that.
 *
 * It flips in a layout effect, i.e. in the commit right after mount and
 * before the browser paints, so a JS-enabled visitor still sees the reveal
 * play from its hidden state with no flash of the finished layout. Readers
 * who asked for less motion simply keep the visible markup.
 */
function useRevealAnimation(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [animated, setAnimated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!prefersReducedMotion) setAnimated(true);
  }, [prefersReducedMotion]);

  return animated;
}

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
  const animated = useRevealAnimation();
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
      // Never "hidden": that would put opacity:0 in the server markup, which
      // is the whole bug. The hidden state is entered after mount instead.
      initial={false}
      animate={animated && !inView ? "hidden" : "visible"}
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

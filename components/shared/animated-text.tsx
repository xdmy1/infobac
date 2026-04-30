"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, type ReactNode } from "react";

type AnimatedTag = "h1" | "h2" | "h3" | "p" | "span";

interface AnimatedTextProps {
  text: string;
  /** Element to render the wrapper as. */
  as?: AnimatedTag;
  /** Delay before the first word reveal. */
  delay?: number;
  /** Stagger between words. */
  stagger?: number;
  /** Duration of each word reveal. */
  duration?: number;
  className?: string;
  /** Optional content to wrap inside specific words — keyed by word index. */
  decorate?: Record<number, (word: string) => ReactNode>;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const motionMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

/**
 * Splits a string into words and reveals each one with a blur + fade-up
 * stagger. Wraps long text gracefully — words wrap on whitespace.
 */
export function AnimatedText({
  text,
  as = "p",
  delay = 0,
  stagger = 0.04,
  duration = 0.8,
  className,
  decorate,
}: AnimatedTextProps) {
  const Tag = motionMap[as];
  const words = text.split(" ");

  return (
    <Tag
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => {
        const wrap = decorate?.[i];
        return (
          <Fragment key={`${word}-${i}`}>
            <motion.span
              className="inline-block"
              variants={wordVariants}
              transition={{ duration, ease: [0.21, 0.47, 0.32, 0.98] }}
              aria-hidden
            >
              {wrap ? wrap(word) : word}
            </motion.span>
            {i < words.length - 1 && " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}

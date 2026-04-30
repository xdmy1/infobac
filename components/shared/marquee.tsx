"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Direction of scroll. */
  direction?: "left" | "right";
  /** Loop duration in seconds — lower = faster. Default 40s. */
  duration?: number;
  /** Gap between repetitions. */
  gap?: string;
  /** Pause animation when the user hovers the marquee (CSS-only). */
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite horizontal scroll. Two CSS-animated tracks render the same
 * children for a seamless loop. CSS-only (no JS animate API), so we don't
 * trip WAAPI offset constraints with `motion`'s repeat semantics.
 */
export function Marquee({
  children,
  direction = "left",
  duration = 40,
  gap = "2rem",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const animationName =
    direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <style>
        {`
@keyframes marquee-left {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-100%, 0, 0); }
}
@keyframes marquee-right {
  from { transform: translate3d(-100%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
}
        `}
      </style>

      <div
        className={cn(
          "flex shrink-0 items-center will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          gap,
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex shrink-0 items-center will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          gap,
          marginLeft: gap,
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

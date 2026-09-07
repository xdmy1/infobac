"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { track, currentPath, type AnalyticsEvents } from "@/lib/analytics/events";

type TrackableEvent = "signup_cta_clicked" | "plan_cta_clicked";

/**
 * A link that records which call-to-action was pressed, and from which page.
 *
 * Clicks are autocaptured anyway, but autocapture identifies an element by its
 * text and position — rewrite the button and last month's funnel breaks. A
 * named event survives copy changes, which matters for the two funnels worth
 * keeping honest: what makes someone create an account, and what makes them
 * open the checkout.
 *
 * `from_path` is filled in at click time. It is the answer to "where were they
 * when they decided", which the destination URL cannot tell you.
 */
export function TrackedLink<E extends TrackableEvent>({
  event,
  properties,
  children,
  onClick,
  ...linkProps
}: LinkProps & {
  event: E;
  properties: Omit<AnalyticsEvents[E], "from_path">;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      {...linkProps}
      onClick={(e) => {
        track(event, {
          ...properties,
          from_path: currentPath(),
        } as AnalyticsEvents[E]);
        // Callers may wrap this in something that needs its own handler — a
        // Sheet that has to close, for instance. Measuring must not replace
        // behaviour.
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}

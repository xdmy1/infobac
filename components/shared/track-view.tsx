"use client";

import { useEffect, useRef } from "react";
import { track, type AnalyticsEvents } from "@/lib/analytics/events";

/**
 * Records an event once, when the page that renders it is shown.
 *
 * Lets a Server Component report something the URL cannot: that this lesson
 * was locked rather than opened, for instance. Renders nothing.
 */
export function TrackView<K extends keyof AnalyticsEvents>({
  event,
  properties,
}: {
  event: K;
  properties: AnalyticsEvents[K];
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, properties);
  }, [event, properties]);

  return null;
}

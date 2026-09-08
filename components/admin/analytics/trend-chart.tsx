"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TrendPoint {
  day: string;
  value: number;
}

/**
 * One metric over time.
 *
 * Deliberately one chart per metric rather than several series on shared axes:
 * visitors and payments differ by two orders of magnitude, and forcing them
 * onto one scale flattens the smaller one into the baseline. Small multiples
 * keep every metric readable at its own scale.
 */
export function TrendChart({
  label,
  points,
  tone = "foreground",
}: {
  label: string;
  points: TrendPoint[];
  tone?: "foreground" | "primary" | "success";
}) {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(...points.map((p) => p.value), 1);
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const barColor =
    tone === "primary"
      ? "bg-primary"
      : tone === "success"
        ? "bg-success"
        : "bg-foreground";

  const active = hover !== null ? points[hover] : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="font-mono text-sm font-bold tabular-nums">
          {new Intl.NumberFormat("ro-MD").format(total)}
        </p>
      </div>

      <div className="relative mt-3">
        {/* The tooltip is pinned above the plot rather than following the
            cursor: at this bar width a floating box would cover its own bar. */}
        <div className="h-5">
          {active && (
            <p className="font-mono text-[11px] tabular-nums text-foreground">
              <span className="font-semibold">{active.value}</span>
              <span className="text-muted-foreground">
                {" · "}
                {new Date(active.day).toLocaleDateString("ro-MD", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </p>
          )}
        </div>

        <div
          className="flex h-20 items-end gap-[2px]"
          onPointerLeave={() => setHover(null)}
        >
          {points.map((p, i) => (
            <button
              key={p.day}
              type="button"
              aria-label={`${p.day}: ${p.value}`}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className="group relative flex h-full flex-1 items-end"
            >
              {/* Full-height hit area — the bar itself can be 1px tall. */}
              <span
                className={cn(
                  "w-full rounded-t-[4px] transition-opacity",
                  barColor,
                  hover !== null && hover !== i ? "opacity-40" : "opacity-100",
                )}
                style={{
                  height: `${Math.max((p.value / max) * 100, p.value > 0 ? 4 : 1.5)}%`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

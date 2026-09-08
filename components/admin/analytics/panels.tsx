import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QueryResult, Row } from "@/lib/analytics/posthog-api";

/** Seconds as something a person reads at a glance. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s ? `${m}m ${s}s` : `${m}m`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("ro-MD").format(Math.round(n));
}

export function num(v: unknown): number {
  return typeof v === "number" ? v : Number(v ?? 0) || 0;
}

export function str(v: unknown): string {
  return v === null || v === undefined || v === "" ? "—" : String(v);
}

/**
 * One section of the dashboard. Owns the failure case, so a query whose shape
 * PostHog rejects costs its own panel and nothing else on the page.
 */
export function Panel({
  title,
  hint,
  result,
  children,
  className,
}: {
  title: string;
  hint?: string;
  /** When given, an error or an empty result renders in place of the children. */
  result?: QueryResult;
  children: React.ReactNode;
  className?: string;
}) {
  const empty = result && !result.error && result.rows.length === 0;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 md:p-6",
        className,
      )}
    >
      <header className="mb-4">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {hint && (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        )}
      </header>

      {result?.error ? (
        <p className="flex items-start gap-2 rounded-xl bg-warning/10 p-3 text-xs text-warning">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {result.error}
        </p>
      ) : empty ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Încă nu sunt date pentru perioada asta.
        </p>
      ) : (
        children
      )}
    </section>
  );
}

/** A headline number. No chart — a single value does not need one. */
export function StatTile({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "warn";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-mono text-3xl font-bold tabular-nums tracking-tight",
          tone === "good" && "text-success",
          tone === "warn" && "text-warning",
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

/**
 * A ranking. Horizontal bars because the labels are text of varying length —
 * vertical bars would turn every URL into a rotated, unreadable tick.
 */
export function RankList({
  rows,
  labelIndex = 0,
  valueIndex = 1,
  secondaryIndex,
  secondaryLabel,
  formatValue = (v) => formatNumber(v),
  formatLabel = (v) => str(v),
}: {
  rows: Row[];
  labelIndex?: number;
  valueIndex?: number;
  secondaryIndex?: number;
  secondaryLabel?: string;
  formatValue?: (v: number) => string;
  formatLabel?: (v: unknown) => string;
}) {
  const max = Math.max(...rows.map((r) => num(r[valueIndex])), 1);

  return (
    <ol className="space-y-1.5">
      {rows.map((r, i) => {
        const value = num(r[valueIndex]);
        return (
          <li key={i} className="group relative">
            <div className="flex items-baseline justify-between gap-3 px-2 py-1.5">
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {formatLabel(r[labelIndex])}
              </span>
              {secondaryIndex !== undefined && (
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatNumber(num(r[secondaryIndex]))}
                  {secondaryLabel ? ` ${secondaryLabel}` : ""}
                </span>
              )}
              <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
                {formatValue(value)}
              </span>
            </div>
            {/* The bar sits behind the row: the number stays readable, and the
                proportion is legible without a second axis. */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 -z-10 rounded-md bg-primary/10"
              style={{ width: `${Math.max((value / max) * 100, 1.5)}%` }}
            />
          </li>
        );
      })}
    </ol>
  );
}

interface FunnelStep {
  label: string;
  value: number;
  hint?: string;
}

/**
 * The conversion funnel, as people rather than events.
 *
 * Each step shows how many of the previous step survived, because the drop is
 * the finding — "80% of the students who hit the paywall never opened the
 * plans" is the sentence worth acting on.
 */
export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const start = Math.max(steps[0]?.value ?? 0, 1);

  return (
    <ol className="space-y-2">
      {steps.map((step, i) => {
        const prev = i === 0 ? null : steps[i - 1].value;
        const share = (step.value / start) * 100;
        const kept = prev && prev > 0 ? (step.value / prev) * 100 : null;
        const lost = kept === null ? null : 100 - kept;

        return (
          <li key={step.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-foreground">
                {step.label}
              </span>
              <span className="flex items-baseline gap-2 font-mono text-sm tabular-nums">
                <span className="font-semibold text-foreground">
                  {formatNumber(step.value)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {share.toFixed(0)}%
                </span>
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground"
                style={{ width: `${Math.max(share, 0.5)}%` }}
              />
            </div>
            {lost !== null && lost > 0 && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {step.hint ? `${step.hint} · ` : ""}
                <span className="text-destructive">
                  −{lost.toFixed(0)}%
                </span>{" "}
                față de pasul anterior
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A plain table for the rows that are records, not rankings. */
export function DataTable({
  headers,
  rows,
  render,
}: {
  headers: string[];
  rows: Row[];
  render: (row: Row, i: number) => React.ReactNode[];
}) {
  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {headers.map((h) => (
              <th
                key={h}
                className="px-2 pb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/60 last:border-b-0 hover:bg-muted/30"
            >
              {render(row, i).map((cell, j) => (
                <td key={j} className="px-2 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

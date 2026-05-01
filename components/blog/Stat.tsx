export function Stat({
  value,
  label,
  caption,
}: {
  value: string;
  label: string;
  caption?: string;
}) {
  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-muted/30 p-5 md:p-6">
      <p className="font-mono text-3xl font-bold tabular-nums tracking-tight md:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold tracking-tight">{label}</p>
      {caption ? (
        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-3">{children}</div>
  );
}

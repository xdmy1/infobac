import { Check, X } from "lucide-react";

export function Compare({
  themTitle,
  themItems,
  usTitle,
  usItems,
}: {
  themTitle: string;
  themItems: string[];
  usTitle: string;
  usItems: string[];
}) {
  return (
    <div className="not-prose my-8 grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {themTitle}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {themItems.map((it) => (
            <li key={it} className="flex items-start gap-2">
              <X className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span className="text-foreground/80 line-through decoration-destructive/40">
                {it}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-hover">
          {usTitle}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {usItems.map((it) => (
            <li key={it} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="font-medium">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { AlertTriangle, Info, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "warn" | "tip" | "success";

const TONES: Record<
  Tone,
  { Icon: typeof Info; cls: string; iconCls: string }
> = {
  info: {
    Icon: Info,
    cls: "border-primary/30 bg-primary/5",
    iconCls: "text-primary",
  },
  warn: {
    Icon: AlertTriangle,
    cls: "border-warning/40 bg-warning/5",
    iconCls: "text-warning",
  },
  tip: {
    Icon: Lightbulb,
    cls: "border-accent/40 bg-accent/5",
    iconCls: "text-accent-hover",
  },
  success: {
    Icon: CheckCircle2,
    cls: "border-success/30 bg-success/5",
    iconCls: "text-success",
  },
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
}) {
  const { Icon, cls, iconCls } = TONES[tone];
  return (
    <aside
      className={cn(
        "not-prose my-6 flex gap-3 rounded-xl border p-4 md:p-5",
        cls,
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconCls)} />
      <div className="space-y-1.5 text-sm leading-relaxed">
        {title ? (
          <p className="font-semibold tracking-tight text-foreground">
            {title}
          </p>
        ) : null}
        <div className="text-foreground/85">{children}</div>
      </div>
    </aside>
  );
}

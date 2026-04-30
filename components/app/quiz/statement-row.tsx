"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatementRowProps {
  index: number;
  text: string;
  /** What the user picked (true = Da, false = Nu, null = unanswered). */
  value: boolean | null;
  /** Correct answer for this statement. */
  correctAnswer: boolean;
  /** Reveal correctness colours (after commit). */
  revealed: boolean;
  disabled?: boolean;
  onPick: (value: boolean) => void;
}

export function StatementRow({
  index,
  text,
  value,
  correctAnswer,
  revealed,
  disabled,
  onPick,
}: StatementRowProps) {
  const userCorrect = value === correctAnswer;

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-3.5 transition-colors sm:flex-row sm:items-start",
        revealed && userCorrect && "border-success/60 bg-success/5",
        revealed && !userCorrect && "border-destructive/60 bg-destructive/5",
        !revealed && "border-border bg-background",
      )}
    >
      <span className="flex flex-1 items-start gap-2 leading-relaxed">
        <span className="mt-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 whitespace-pre-wrap break-words text-sm">{text}</span>
      </span>

      <div className="flex shrink-0 gap-2">
        {([
          { v: true, label: "Adevărat" },
          { v: false, label: "Fals" },
        ] as const).map(({ v, label }) => {
          const selected = value === v;
          let chip: "neutral" | "selected" | "correct" | "incorrect" = "neutral";
          if (revealed) {
            if (selected && correctAnswer === v) chip = "correct";
            else if (selected && correctAnswer !== v) chip = "incorrect";
            else if (!selected && correctAnswer === v) chip = "correct";
          } else if (selected) {
            chip = "selected";
          }
          return (
            <button
              key={label}
              type="button"
              onClick={() => onPick(v)}
              disabled={revealed || disabled}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                chip === "neutral" &&
                  "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                chip === "selected" &&
                  "border-primary bg-primary text-primary-foreground",
                chip === "correct" &&
                  "border-success bg-success text-white",
                chip === "incorrect" &&
                  "border-destructive bg-destructive text-white",
                (revealed || disabled) && "cursor-default",
              )}
            >
              {chip === "correct" && <CheckCircle2 className="size-3.5" />}
              {chip === "incorrect" && <XCircle className="size-3.5" />}
              {label}
            </button>
          );
        })}
      </div>
    </li>
  );
}

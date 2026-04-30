"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionRowProps {
  index: number;
  text: string;
  selected: boolean;
  /**
   * `revealed` — true after the user committed an answer (practice) or
   * after submission (exam results). When revealed, the row shows correct/
   * incorrect colours and disables clicks.
   */
  revealed: boolean;
  isCorrect: boolean;
  /** True for multi-select questions — uses checkbox visual instead of dot. */
  multi: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function OptionRow({
  index,
  text,
  selected,
  revealed,
  isCorrect,
  multi,
  disabled,
  onClick,
}: OptionRowProps) {
  let visual: "neutral" | "selected" | "correct" | "incorrect" | "missed" = "neutral";

  if (revealed) {
    if (isCorrect && selected) visual = "correct";
    else if (isCorrect && !selected) visual = "missed";
    else if (!isCorrect && selected) visual = "incorrect";
  } else if (selected) {
    visual = "selected";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed || disabled}
      className={cn(
        "group flex w-full min-w-0 items-start gap-2.5 rounded-xl border px-3 py-3 text-left text-[13.5px] transition-all sm:gap-3 sm:px-3.5 sm:text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        visual === "neutral" &&
          "border-border bg-background hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-muted/40 hover:shadow-sm",
        visual === "selected" &&
          "border-primary bg-primary/5 text-foreground shadow-sm",
        visual === "correct" &&
          "border-success/60 bg-success/10 text-foreground",
        visual === "incorrect" &&
          "border-destructive/60 bg-destructive/10 text-foreground",
        visual === "missed" &&
          "border-success/40 bg-success/5 text-foreground/80",
        (revealed || disabled) && "cursor-default hover:translate-y-0 hover:shadow-none",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-[11px] font-bold uppercase",
          multi ? "rounded-md" : "rounded-full",
          "border transition-colors",
          visual === "neutral" && "border-border bg-card text-muted-foreground",
          visual === "selected" &&
            "border-primary bg-primary text-primary-foreground",
          visual === "correct" && "border-success bg-success text-white",
          visual === "incorrect" &&
            "border-destructive bg-destructive text-white",
          visual === "missed" && "border-success/60 bg-success/40 text-white",
        )}
      >
        {LETTERS[index] ?? String(index + 1)}
      </span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words leading-relaxed">{text}</span>
      {revealed && isCorrect && (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
      )}
      {revealed && selected && !isCorrect && (
        <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
      )}
    </button>
  );
}

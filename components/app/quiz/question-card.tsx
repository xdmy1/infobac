"use client";

import { motion, AnimatePresence } from "motion/react";
import { Lightbulb } from "lucide-react";
import type { Question } from "@/lib/content/courses/types";
import type { AnswerValue } from "./quiz-types";
import { OptionRow } from "./option-row";
import { StatementRow } from "./statement-row";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  answer: AnswerValue;
  revealed: boolean;
  /** Hide the explanation panel even if revealed (useful for exam summary lists). */
  hideExplanation?: boolean;
  onPickSingle: (idx: number) => void;
  onToggleMulti: (idx: number) => void;
  onPickStatement: (statementIdx: number, value: boolean) => void;
}

export function QuestionCard({
  question,
  index,
  total,
  answer,
  revealed,
  hideExplanation,
  onPickSingle,
  onToggleMulti,
  onPickStatement,
}: QuestionCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 md:p-6">
      <header className="mb-4 flex flex-wrap items-center gap-2 text-[11px] sm:gap-3 sm:text-xs">
        <span className="rounded-full bg-muted px-2 py-1 font-mono font-semibold tabular-nums sm:px-2.5">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="max-w-full truncate rounded-full border border-border px-2 py-1 font-medium text-muted-foreground sm:px-2.5">
          {question.topic}
        </span>
        <span className="rounded-full bg-muted/50 px-2 py-1 font-medium text-muted-foreground sm:px-2.5">
          {question.type === "single" && "Alege una"}
          {question.type === "multi" && `Alege ${(question.type === "multi" && question.min) || 2}`}
          {question.type === "yesno" && "Adevărat / Fals"}
        </span>
      </header>

      <h2 className="mb-5 whitespace-pre-wrap break-words text-pretty text-[15px] font-semibold leading-relaxed text-foreground sm:text-base md:text-lg">
        {question.prompt}
      </h2>

      {/* SINGLE */}
      {question.type === "single" && answer.type === "single" && (
        <ul className="space-y-2.5">
          {question.options.map((opt, i) => (
            <li key={i}>
              <OptionRow
                index={i}
                text={opt}
                multi={false}
                selected={answer.index === i}
                revealed={revealed}
                isCorrect={i === question.correctIndex}
                onClick={() => onPickSingle(i)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* MULTI */}
      {question.type === "multi" && answer.type === "multi" && (
        <ul className="space-y-2.5">
          {question.options.map((opt, i) => (
            <li key={i}>
              <OptionRow
                index={i}
                text={opt}
                multi
                selected={answer.indices.includes(i)}
                revealed={revealed}
                isCorrect={question.correctIndices.includes(i)}
                onClick={() => onToggleMulti(i)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* YES/NO multi-statement */}
      {question.type === "yesno" && answer.type === "yesno" && (
        <ul className="space-y-2.5">
          {question.statements.map((s, i) => (
            <StatementRow
              key={i}
              index={i}
              text={s.text}
              value={answer.values[i]}
              correctAnswer={s.correct}
              revealed={revealed}
              onPick={(v) => onPickStatement(i, v)}
            />
          ))}
        </ul>
      )}

      <AnimatePresence>
        {revealed && !hideExplanation && question.explanation && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="mt-5 flex gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4">
              <Lightbulb
                className="mt-0.5 size-4 shrink-0 text-accent"
                strokeWidth={2}
              />
              <div className="flex-1 text-sm leading-relaxed text-foreground/85">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                  Explicație
                </p>
                <p className="whitespace-pre-wrap text-pretty">
                  {question.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

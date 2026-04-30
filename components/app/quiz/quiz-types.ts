import type { Question } from "@/lib/content/courses/types";

export type QuizMode = "practice" | "exam";

/**
 * Per-question answer storage.
 *  - single → selected option index (or undefined if unanswered)
 *  - multi  → array of selected indices (sorted, may be empty until min met)
 *  - yesno  → boolean per statement, keyed by statement index
 */
export type AnswerValue =
  | { type: "single"; index: number | null }
  | { type: "multi"; indices: number[] }
  | { type: "yesno"; values: (boolean | null)[] };

export type AnswerMap = Record<string, AnswerValue>;

export function emptyAnswerFor(q: Question): AnswerValue {
  if (q.type === "single") return { type: "single", index: null };
  if (q.type === "multi") return { type: "multi", indices: [] };
  return {
    type: "yesno",
    values: q.statements.map(() => null),
  };
}

export function isFullyAnswered(q: Question, a: AnswerValue | undefined): boolean {
  if (!a) return false;
  if (a.type === "single") return a.index !== null;
  if (a.type === "multi") {
    if (q.type !== "multi") return false;
    return a.indices.length >= q.min;
  }
  if (a.type === "yesno") return a.values.every((v) => v !== null);
  return false;
}

export function isCorrect(q: Question, a: AnswerValue | undefined): boolean {
  if (!a) return false;
  if (q.type === "single" && a.type === "single") {
    return a.index === q.correctIndex;
  }
  if (q.type === "multi" && a.type === "multi") {
    const expected = [...q.correctIndices].sort((x, y) => x - y);
    const got = [...a.indices].sort((x, y) => x - y);
    if (expected.length !== got.length) return false;
    return expected.every((v, i) => v === got[i]);
  }
  if (q.type === "yesno" && a.type === "yesno") {
    return q.statements.every((s, i) => a.values[i] === s.correct);
  }
  return false;
}

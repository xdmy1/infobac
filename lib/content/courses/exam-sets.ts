import type { CourseSlug, Question } from "./types";
import { getCourseContent } from "./index";

export interface ExamSet {
  /** 1-based exam number. */
  number: number;
  /** Display label, e.g. "Examen 1". */
  label: string;
  /** Questions belonging to this exam (stable subset of the course pool). */
  questions: Question[];
  /** Suggested duration in minutes. */
  durationMin: number;
}

const TARGET_QUESTIONS_PER_EXAM = 30;

/** Roughly 1 minute / question + a 5-minute buffer, rounded up to the nearest 5. */
function durationFor(n: number): number {
  const raw = n + 5;
  return Math.ceil(raw / 5) * 5;
}

/**
 * Split a course's question pool into multiple ~30-question exams. Same
 * input → same output (no shuffle here; randomisation happens client-side
 * when the session starts), so "Examen 2" always points at the same
 * questions across visits. Lets us show stats per-exam and lets students
 * retry a specific exam.
 */
export function getExamSetsForCourse(slug: CourseSlug): ExamSet[] {
  const content = getCourseContent(slug);
  if (!content) return [];
  const all = [...content.questions];
  const total = all.length;
  if (total === 0) return [];

  const numExams = Math.max(1, Math.round(total / TARGET_QUESTIONS_PER_EXAM));
  const chunkSize = Math.ceil(total / numExams);
  const sets: ExamSet[] = [];
  for (let i = 0; i < numExams; i++) {
    const slice = all.slice(i * chunkSize, (i + 1) * chunkSize);
    if (slice.length === 0) continue;
    sets.push({
      number: i + 1,
      label: `Examen ${i + 1}`,
      questions: slice,
      durationMin: durationFor(slice.length),
    });
  }
  return sets;
}

export function getExamSet(
  slug: CourseSlug,
  examNumber: number,
): ExamSet | null {
  const sets = getExamSetsForCourse(slug);
  return sets.find((s) => s.number === examNumber) ?? null;
}

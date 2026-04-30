import type { CourseSlug, Question } from "./types";
import { getCourseContent } from "./index";

export interface TestSet {
  /** 1-based set number. */
  number: number;
  /** Questions belonging to this set (stable subset of the course pool). */
  questions: Question[];
  /** Suggested duration for exam mode, in minutes. */
  durationMin: number;
}

// Certiport IT Specialist exams are roughly 40 questions / 50 minutes.
// We mirror that here so practice and exam mirror the real format.
const TARGET_QUESTIONS_PER_SET = 40;
const EXAM_DURATION_MIN = 50;

/**
 * Split a course's question pool into multiple ~40-question sets. Each
 * set powers BOTH a practice test (instant feedback, no timer) and an
 * exam simulation (timed, no inline feedback) — see /curs/[slug]/test
 * for the picker.
 *
 * Stable: "Set 2" always contains the same questions across visits.
 * Order is shuffled at session start, but the membership doesn't change.
 */
export function getTestSetsForCourse(slug: CourseSlug): TestSet[] {
  const content = getCourseContent(slug);
  if (!content) return [];
  const all = [...content.questions];
  const total = all.length;
  if (total === 0) return [];

  const numSets = Math.max(1, Math.round(total / TARGET_QUESTIONS_PER_SET));
  const chunkSize = Math.ceil(total / numSets);
  const sets: TestSet[] = [];
  for (let i = 0; i < numSets; i++) {
    const slice = all.slice(i * chunkSize, (i + 1) * chunkSize);
    if (slice.length === 0) continue;
    sets.push({
      number: i + 1,
      questions: slice,
      durationMin: EXAM_DURATION_MIN,
    });
  }
  return sets;
}

export function getTestSet(
  slug: CourseSlug,
  setNumber: number,
): TestSet | null {
  const sets = getTestSetsForCourse(slug);
  return sets.find((s) => s.number === setNumber) ?? null;
}

// Backwards-compat aliases — older imports still work.
export const getExamSetsForCourse = getTestSetsForCourse;
export const getExamSet = getTestSet;
export type ExamSet = TestSet;

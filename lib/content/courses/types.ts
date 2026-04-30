/**
 * Canonical content shapes for course material delivered statically (not via DB).
 * Lessons are markdown strings; questions are a discriminated union over the
 * three rendering modes the quiz player handles.
 */

export type CourseSlug = "python" | "devices" | "sql";

export type Difficulty = "începător" | "intermediar" | "avansat";

export interface CourseMeta {
  slug: CourseSlug;
  title: string;
  blurb: string;
  /** Long-form description shown on course detail. */
  description: string;
  /** Estimated total study time in human-readable Romanian. */
  duration: string;
  difficulty: Difficulty;
  /** Image path under /public/courses/. */
  icon: string;
  /** Tailwind accent token name. */
  accent: "primary" | "accent" | "warning" | "success";
  /** Pass threshold for simulation mode (0-100). */
  passingScore: number;
  /** Human-readable count strings used on overview cards. */
  topics: string[];
}

export interface Lesson {
  slug: string;
  title: string;
  /** 1-based position. */
  orderIndex: number;
  durationMinutes: number;
  /** True for the first 1–2 lessons that are unlocked without payment. */
  isPreview: boolean;
  /** GitHub-flavoured markdown body, rendered with react-markdown + remark-gfm. */
  markdown: string;
}

export type Question = SingleQuestion | MultiQuestion | YesNoQuestion;

export interface SingleQuestion {
  id: string;
  type: "single";
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MultiQuestion {
  id: string;
  type: "multi";
  topic: string;
  prompt: string;
  options: string[];
  correctIndices: number[];
  min: number;
  explanation: string;
}

export interface YesNoQuestion {
  id: string;
  type: "yesno";
  topic: string;
  prompt: string;
  statements: { text: string; correct: boolean }[];
  explanation: string;
}

export interface CourseModule {
  meta: CourseMeta;
  lessons: readonly Lesson[];
  questions: readonly Question[];
}

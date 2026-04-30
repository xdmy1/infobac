// =============================================================================
// Preview mode — lets you see authenticated UI without configuring Supabase.
//
// Enable by setting NEXT_PUBLIC_PREVIEW_MODE=1 in .env.local. When active AND
// Supabase env vars are missing, the (app) layout serves mock data instead
// of redirecting to /login. Useful for design review and screenshots.
//
// In production (Supabase configured), this flag is ignored — real data wins.
// =============================================================================

import type { CourseProgressSummary } from "@/lib/queries/progress";
import type { SubscriptionRow } from "@/lib/queries/subscription";
import type { ProfileRow } from "@/lib/queries/user";
import type { MyCourseRow, LessonRow } from "@/lib/queries/courses";
import type { Database, QuizOption } from "@/lib/supabase/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];
type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type QuizAttemptRow = Database["public"]["Tables"]["quiz_attempts"]["Row"];

export const isPreviewModeFlag =
  process.env.NEXT_PUBLIC_PREVIEW_MODE === "1";

/**
 * True only when:
 *  - the flag is on, AND
 *  - Supabase isn't configured (so there's no real data to show).
 *
 * If both flag and Supabase are present, real data takes precedence — you
 * never accidentally serve mock data to a logged-in user.
 */
export const isPreviewMode = isPreviewModeFlag && !isSupabaseConfigured;

// -----------------------------------------------------------------------------
// Mock identities (stable IDs, so progress/quizzes can join cleanly later).
// -----------------------------------------------------------------------------

export const previewUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "andrei.preview@infobac.md",
  user_metadata: {
    full_name: "Andrei Preview",
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as const;

export const previewProfile: ProfileRow = {
  id: previewUser.id,
  email: previewUser.email,
  full_name: "Andrei Preview",
  avatar_url: null,
  school: "Liceul Mircea Eliade, Chișinău",
  grade: 12,
  role: "student",
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

const courseIds = {
  python: "11111111-1111-1111-1111-111111111111",
  sql: "22222222-2222-2222-2222-222222222222",
  networking: "33333333-3333-3333-3333-333333333333",
} as const;

export const previewCourses: MyCourseRow[] = [
  {
    id: courseIds.python,
    slug: "python",
    title: "Python",
    description: "Limbajul de programare pe care se construiește totul.",
    order_index: 1,
    estimated_duration: "4–6 săptămâni",
    difficulty: "medium",
    icon: "/courses/python.png",
    granted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: null,
    source: "manual",
    is_active: true,
  },
  {
    id: courseIds.sql,
    slug: "sql",
    title: "Databases / SQL",
    description: "Baze de date relaționale, SQL, normalizare, JOIN-uri.",
    order_index: 2,
    estimated_duration: "3–4 săptămâni",
    difficulty: "medium",
    icon: "/courses/sql.png",
    granted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: null,
    source: "manual",
    is_active: true,
  },
  {
    id: courseIds.networking,
    slug: "networking",
    title: "Networking & Devices",
    description: "Structura calculatorului și rețele.",
    order_index: 3,
    estimated_duration: "1 zi (serios)",
    difficulty: "easy",
    icon: "/courses/networking-devices.png",
    granted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: null,
    source: "manual",
    is_active: true,
  },
];

export const previewProgressMap: Record<string, CourseProgressSummary> = {
  [courseIds.python]: {
    courseId: courseIds.python,
    totalLessons: 7,
    completedLessons: 6,
    percent: 87,
    lastTouchedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  [courseIds.sql]: {
    courseId: courseIds.sql,
    totalLessons: 6,
    completedLessons: 4,
    percent: 64,
    lastTouchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  [courseIds.networking]: {
    courseId: courseIds.networking,
    totalLessons: 5,
    completedLessons: 1,
    percent: 12,
    lastTouchedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
};

const inOneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

export const previewSubscription: SubscriptionRow = {
  id: "44444444-4444-4444-4444-444444444444",
  user_id: previewUser.id,
  plan: "all",
  status: "active",
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(
    Date.now() + 21 * 24 * 60 * 60 * 1000
  ).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// -----------------------------------------------------------------------------
// Course rows (full Row shape — for course detail pages)
// -----------------------------------------------------------------------------

export const previewCoursesFull: Record<string, CourseRow> = {
  python: {
    id: courseIds.python,
    slug: "python",
    title: "Python",
    description:
      "Limbajul de programare pe care se construiește totul. Sintaxă, structuri de control, funcții, OOP minimal — exact ce verifică examenul A Certiport IT Specialist.",
    order_index: 1,
    estimated_duration: "4–6 săptămâni",
    difficulty: "medium",
    icon: "/courses/python.png",
    created_at: new Date().toISOString(),
  },
  sql: {
    id: courseIds.sql,
    slug: "sql",
    title: "Databases / SQL",
    description:
      "Baze de date relaționale, SQL, normalizare, JOIN-uri. Logic și frumos după ce vezi exemple. Pregătire pentru examenul B.",
    order_index: 2,
    estimated_duration: "3–4 săptămâni",
    difficulty: "medium",
    icon: "/courses/sql.png",
    created_at: new Date().toISOString(),
  },
  networking: {
    id: courseIds.networking,
    slug: "networking",
    title: "Networking & Devices",
    description:
      "Structura calculatorului și rețele. Cel mai ușor — îl înveți într-o zi dacă te concentrezi.",
    order_index: 3,
    estimated_duration: "1 zi (serios)",
    difficulty: "easy",
    icon: "/courses/networking-devices.png",
    created_at: new Date().toISOString(),
  },
};

// -----------------------------------------------------------------------------
// Lesson rows — small set per course, just enough to test the UI shape.
// Real content arrives later via /supabase/seed.sql + the team's writing.
// -----------------------------------------------------------------------------

const lessonId = (courseSlug: string, n: number) =>
  `${courseSlug}-lesson-${String(n).padStart(2, "0")}-aaaa-aaaa-aaaaaaaaaaaa`.slice(
    0,
    36
  );

const sampleMarkdown = (title: string) =>
  `# ${title}

[Conținutul real va fi adăugat de echipă.] Această lecție e un placeholder
ca să poți vedea cum arată player-ul de lecții.

## Ce înveți aici

- Concept de bază
- Un exemplu rapid
- O capcană comună de evitat

\`\`\`python
# Un fragment scurt de cod
print("Salut, BAC!")
\`\`\`

> Sfat: nu te grăbi. Citește exemplul, încearcă-l tu, abia apoi treci la
> următoarea lecție.

Când ești gata, marchează lecția ca terminată cu butonul de jos.`;

export const previewLessonsByCourse: Record<string, LessonRow[]> = {
  python: [
    {
      id: lessonId("python", 1),
      course_id: courseIds.python,
      slug: "introducere",
      title: "Introducere în Python",
      content: sampleMarkdown("Introducere în Python"),
      video_url: null,
      duration_minutes: 20,
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: lessonId("python", 2),
      course_id: courseIds.python,
      slug: "tipuri-de-date",
      title: "Tipuri de date și operatori",
      content: sampleMarkdown("Tipuri de date și operatori"),
      video_url: null,
      duration_minutes: 35,
      order_index: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: lessonId("python", 3),
      course_id: courseIds.python,
      slug: "flow-control",
      title: "Flow control — if, while, for",
      content: sampleMarkdown("Flow control"),
      video_url: null,
      duration_minutes: 45,
      order_index: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: lessonId("python", 4),
      course_id: courseIds.python,
      slug: "functii",
      title: "Funcții și module",
      content: sampleMarkdown("Funcții"),
      video_url: null,
      duration_minutes: 40,
      order_index: 4,
      created_at: new Date().toISOString(),
    },
  ],
  sql: [
    {
      id: lessonId("sql", 1),
      course_id: courseIds.sql,
      slug: "introducere",
      title: "Ce e o bază de date relațională",
      content: sampleMarkdown("Baze de date"),
      video_url: null,
      duration_minutes: 20,
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: lessonId("sql", 2),
      course_id: courseIds.sql,
      slug: "select-where",
      title: "SELECT, WHERE, ORDER BY",
      content: sampleMarkdown("SELECT"),
      video_url: null,
      duration_minutes: 45,
      order_index: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: lessonId("sql", 3),
      course_id: courseIds.sql,
      slug: "join-uri",
      title: "JOIN-uri: INNER, LEFT, RIGHT",
      content: sampleMarkdown("JOIN-uri"),
      video_url: null,
      duration_minutes: 55,
      order_index: 3,
      created_at: new Date().toISOString(),
    },
  ],
  networking: [
    {
      id: lessonId("networking", 1),
      course_id: courseIds.networking,
      slug: "hardware",
      title: "Componente hardware ale calculatorului",
      content: sampleMarkdown("Hardware"),
      video_url: null,
      duration_minutes: 25,
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: lessonId("networking", 2),
      course_id: courseIds.networking,
      slug: "retea",
      title: "Conectivitate de rețea",
      content: sampleMarkdown("Rețea"),
      video_url: null,
      duration_minutes: 30,
      order_index: 2,
      created_at: new Date().toISOString(),
    },
  ],
};

// Lessons completed by the preview user (matches previewProgressMap counts).
export const previewCompletedLessonIds = new Set<string>([
  // Python — 6 of 7 complete (87%); we ship 4 mock lessons, so mark 3 complete.
  lessonId("python", 1),
  lessonId("python", 2),
  lessonId("python", 3),
  // SQL — 4 of 6 complete (64%); 2 of 3 mock complete.
  lessonId("sql", 1),
  lessonId("sql", 2),
  // Networking — 1 of 5 complete (12%); 0 of 2 mock complete (matches the
  // "just started" feel).
]);

// -----------------------------------------------------------------------------
// Quizzes & questions — one practice quiz per course, 3 questions each.
// -----------------------------------------------------------------------------

const quizId = (courseSlug: string, n: number) =>
  `${courseSlug}-quiz-${String(n).padStart(2, "0")}-bbbb-bbbb-bbbbbbbbbbbb`.slice(
    0,
    36
  );

const questionId = (courseSlug: string, n: number) =>
  `${courseSlug}-q${String(n).padStart(2, "0")}-cccc-cccc-cccc-cccccccccccc`.slice(
    0,
    36
  );

const opt = (id: string, text: string): QuizOption => ({ id, text });

export const previewQuizzesByCourse: Record<string, QuizRow[]> = {
  python: [
    {
      id: quizId("python", 1),
      course_id: courseIds.python,
      title: "Python — Auto-evaluare rapidă",
      type: "practice",
      time_limit_minutes: 15,
      passing_score: 70,
      created_at: new Date().toISOString(),
    },
  ],
  sql: [
    {
      id: quizId("sql", 1),
      course_id: courseIds.sql,
      title: "SQL — Auto-evaluare rapidă",
      type: "practice",
      time_limit_minutes: 15,
      passing_score: 70,
      created_at: new Date().toISOString(),
    },
  ],
  networking: [
    {
      id: quizId("networking", 1),
      course_id: courseIds.networking,
      title: "Networking — Auto-evaluare rapidă",
      type: "practice",
      time_limit_minutes: 15,
      passing_score: 70,
      created_at: new Date().toISOString(),
    },
  ],
};

export const previewQuestionsByQuiz: Record<string, QuestionRow[]> = {
  [quizId("python", 1)]: [
    {
      id: questionId("python", 1),
      quiz_id: quizId("python", 1),
      question_text: "Care e tipul rezultatului expresiei: 5 / 2 în Python 3?",
      options: [
        opt("a", "int (2)"),
        opt("b", "float (2.5)"),
        opt("c", "str (\"2.5\")"),
        opt("d", "eroare"),
      ],
      correct_option_id: "b",
      explanation:
        "În Python 3, operatorul / produce întotdeauna float. Pentru împărțire întreagă folosești //.",
      topic_tag: "tipuri-de-date",
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: questionId("python", 2),
      quiz_id: quizId("python", 1),
      question_text: "Ce afișează: print(len(\"Salut\"))?",
      options: [
        opt("a", "4"),
        opt("b", "5"),
        opt("c", "6"),
        opt("d", "eroare"),
      ],
      correct_option_id: "b",
      explanation:
        `len() returnează numărul de caractere. „Salut" are 5 caractere.`,
      topic_tag: "tipuri-de-date",
      order_index: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: questionId("python", 3),
      quiz_id: quizId("python", 1),
      question_text: "Cum prinzi o eroare de tip ValueError în Python?",
      options: [
        opt("a", "if error == ValueError"),
        opt("b", "try / except ValueError"),
        opt("c", "catch ValueError"),
        opt("d", "on error ValueError"),
      ],
      correct_option_id: "b",
      explanation: "În Python, excepțiile se prind cu try/except.",
      topic_tag: "error-handling",
      order_index: 3,
      created_at: new Date().toISOString(),
    },
  ],
  [quizId("sql", 1)]: [
    {
      id: questionId("sql", 1),
      quiz_id: quizId("sql", 1),
      question_text: "Care clauză filtrează rândurile într-o interogare?",
      options: [
        opt("a", "WHERE"),
        opt("b", "FILTER"),
        opt("c", "HAVING"),
        opt("d", "GROUP BY"),
      ],
      correct_option_id: "a",
      explanation:
        "WHERE filtrează rândurile înainte de agregare. HAVING filtrează după GROUP BY.",
      topic_tag: "select",
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: questionId("sql", 2),
      quiz_id: quizId("sql", 1),
      question_text: "Care JOIN păstrează toate rândurile din tabelul stâng?",
      options: [
        opt("a", "INNER JOIN"),
        opt("b", "LEFT JOIN"),
        opt("c", "RIGHT JOIN"),
        opt("d", "FULL JOIN"),
      ],
      correct_option_id: "b",
      explanation:
        "LEFT JOIN păstrează toate rândurile din stânga; cele fără match primesc NULL.",
      topic_tag: "joins",
      order_index: 2,
      created_at: new Date().toISOString(),
    },
  ],
  [quizId("networking", 1)]: [
    {
      id: questionId("networking", 1),
      quiz_id: quizId("networking", 1),
      question_text: "Care componentă procesează instrucțiunile programelor?",
      options: [
        opt("a", "RAM"),
        opt("b", "HDD"),
        opt("c", "CPU"),
        opt("d", "GPU"),
      ],
      correct_option_id: "c",
      explanation:
        "CPU (Central Processing Unit) execută instrucțiunile.",
      topic_tag: "hardware",
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: questionId("networking", 2),
      quiz_id: quizId("networking", 1),
      question_text: "Ce e DNS?",
      options: [
        opt("a", "sistem care convertește nume domenii în IP-uri"),
        opt("b", "firewall"),
        opt("c", "protocol email"),
        opt("d", "tip de cablu rețea"),
      ],
      correct_option_id: "a",
      explanation: "DNS = Domain Name System.",
      topic_tag: "retea",
      order_index: 2,
      created_at: new Date().toISOString(),
    },
  ],
};

// -----------------------------------------------------------------------------
// Lookups by ID — used when a page receives a quiz_id or lesson_id from URL.
// -----------------------------------------------------------------------------

export function findPreviewLesson(
  courseSlug: string,
  lessonSlugOrId: string
): { course: CourseRow; lesson: LessonRow } | null {
  const course = previewCoursesFull[courseSlug];
  if (!course) return null;
  const lessons = previewLessonsByCourse[courseSlug] ?? [];
  const lesson =
    lessons.find((l) => l.id === lessonSlugOrId) ??
    lessons.find((l) => l.slug === lessonSlugOrId);
  if (!lesson) return null;
  return { course, lesson };
}

export function findPreviewQuiz(quizIdOrSlug: string): {
  quiz: QuizRow;
  course: CourseRow;
  questions: QuestionRow[];
} | null {
  for (const [, quizzes] of Object.entries(previewQuizzesByCourse)) {
    for (const q of quizzes) {
      if (q.id === quizIdOrSlug) {
        const course = Object.values(previewCoursesFull).find(
          (c) => c.id === q.course_id
        );
        if (!course) return null;
        return {
          quiz: q,
          course,
          questions: previewQuestionsByQuiz[q.id] ?? [],
        };
      }
    }
  }
  return null;
}

// -----------------------------------------------------------------------------
// Recent quiz attempts (for /progres)
// -----------------------------------------------------------------------------

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const previewQuizAttempts: Array<
  QuizAttemptRow & { quiz: { title: string; type: QuizRow["type"]; course_id: string } }
> = [
  {
    id: "att-1",
    user_id: previewUser.id,
    quiz_id: quizId("python", 1),
    course_slug: null,
    mode: null,
    started_at: daysAgo(0),
    completed_at: daysAgo(0),
    score: 100,
    answers: { q1: "b", q2: "b", q3: "b" },
    created_at: daysAgo(0),
    quiz: {
      title: "Python — Auto-evaluare rapidă",
      type: "practice",
      course_id: courseIds.python,
    },
  },
  {
    id: "att-2",
    user_id: previewUser.id,
    quiz_id: quizId("sql", 1),
    course_slug: null,
    mode: null,
    started_at: daysAgo(2),
    completed_at: daysAgo(2),
    score: 50,
    answers: { q1: "a", q2: "a" },
    created_at: daysAgo(2),
    quiz: {
      title: "SQL — Auto-evaluare rapidă",
      type: "practice",
      course_id: courseIds.sql,
    },
  },
  {
    id: "att-3",
    user_id: previewUser.id,
    quiz_id: quizId("python", 1),
    course_slug: null,
    mode: null,
    started_at: daysAgo(5),
    completed_at: daysAgo(5),
    score: 67,
    answers: { q1: "b", q2: "a", q3: "b" },
    created_at: daysAgo(5),
    quiz: {
      title: "Python — Auto-evaluare rapidă",
      type: "practice",
      course_id: courseIds.python,
    },
  },
];

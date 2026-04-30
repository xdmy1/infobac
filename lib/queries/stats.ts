import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CourseSlug } from "@/lib/content/courses";

type Client = SupabaseClient<Database>;

export interface TopicStat {
  topic: string;
  total: number;
  correct: number;
  /** 0-100. */
  accuracy: number;
}

export interface CourseStats {
  courseSlug: CourseSlug;
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  /** 0-100 across all answered questions. */
  overallAccuracy: number;
  /** Best single-attempt score, 0-100. */
  bestScore: number;
  /** Last attempt timestamp ISO. */
  lastAttemptAt: string | null;
  /** Per-topic breakdown sorted by accuracy desc. */
  topics: TopicStat[];
  /** Topics where the user is weakest (accuracy ascending, min 3 answers). */
  weakest: TopicStat[];
  /** Topics where the user is strongest (accuracy descending, min 3 answers). */
  strongest: TopicStat[];
  /** Last 7 days: scores in chronological order (oldest first). */
  recentScores: { score: number; date: string }[];
}

interface PerQuestionShape {
  qid?: string;
  topic?: string;
  qtype?: "single" | "multi" | "yesno";
  correct?: boolean;
}

interface AnswersShape {
  perQuestion?: PerQuestionShape[];
  correctCount?: number;
  totalQuestions?: number;
}

const EMPTY: Omit<CourseStats, "courseSlug"> = {
  totalAttempts: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  bestScore: 0,
  lastAttemptAt: null,
  topics: [],
  weakest: [],
  strongest: [],
  recentScores: [],
};

/**
 * Aggregates exam attempts for a course into per-topic accuracy + summary
 * stats. Used to power the strengths/weaknesses panel on the dashboard.
 *
 * Only `mode = 'exam'` attempts count. Practice mode is unsaved by design.
 */
export async function getCourseStats(
  client: Client,
  courseSlug: CourseSlug,
): Promise<CourseStats> {
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return { courseSlug, ...EMPTY };

    const { data, error } = await client
      .from("quiz_attempts")
      .select("score, completed_at, answers")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("mode", "exam")
      .order("completed_at", { ascending: false });

    if (error || !data) {
      console.warn("[stats] fetch failed:", error?.message);
      return { courseSlug, ...EMPTY };
    }

    const topicAgg = new Map<string, { total: number; correct: number }>();
    let totalQuestions = 0;
    let totalCorrect = 0;
    let bestScore = 0;
    let lastAttemptAt: string | null = null;
    const recent: { score: number; date: string }[] = [];

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const row of data) {
      const ans = (row.answers ?? {}) as AnswersShape;
      const score = row.score ?? 0;
      if (score > bestScore) bestScore = score;
      if (
        row.completed_at &&
        (!lastAttemptAt || row.completed_at > lastAttemptAt)
      ) {
        lastAttemptAt = row.completed_at;
      }
      if (
        row.completed_at &&
        new Date(row.completed_at).getTime() >= sevenDaysAgo
      ) {
        recent.push({ score, date: row.completed_at });
      }

      const pq = ans.perQuestion ?? [];
      for (const q of pq) {
        if (!q.topic) continue;
        const t = topicAgg.get(q.topic) ?? { total: 0, correct: 0 };
        t.total++;
        if (q.correct) t.correct++;
        topicAgg.set(q.topic, t);
        totalQuestions++;
        if (q.correct) totalCorrect++;
      }
    }

    const topics: TopicStat[] = Array.from(topicAgg.entries())
      .map(([topic, t]) => ({
        topic,
        total: t.total,
        correct: t.correct,
        accuracy: t.total === 0 ? 0 : Math.round((t.correct / t.total) * 100),
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    const significant = topics.filter((t) => t.total >= 3);
    const strongest = [...significant]
      .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)
      .slice(0, 3);
    const weakest = [...significant]
      .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
      .slice(0, 3);

    return {
      courseSlug,
      totalAttempts: data.length,
      totalQuestions,
      totalCorrect,
      overallAccuracy:
        totalQuestions === 0
          ? 0
          : Math.round((totalCorrect / totalQuestions) * 100),
      bestScore,
      lastAttemptAt,
      topics,
      strongest,
      weakest,
      recentScores: recent.slice().reverse(),
    };
  } catch (e) {
    console.warn("[stats] error:", e);
    return { courseSlug, ...EMPTY };
  }
}

export interface OverallStats {
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  /** Course slug → CourseStats. */
  byCourse: Record<CourseSlug, CourseStats>;
  /** Aggregated weakest topics across all courses (min 3 answers). */
  weakest: (TopicStat & { courseSlug: CourseSlug })[];
  /** Aggregated strongest topics across all courses (min 3 answers). */
  strongest: (TopicStat & { courseSlug: CourseSlug })[];
}

export async function getOverallStats(
  client: Client,
  slugs: readonly CourseSlug[],
): Promise<OverallStats> {
  const byCourse = {} as Record<CourseSlug, CourseStats>;
  await Promise.all(
    slugs.map(async (slug) => {
      byCourse[slug] = await getCourseStats(client, slug);
    }),
  );

  let totalAttempts = 0;
  let totalQuestions = 0;
  let totalCorrect = 0;
  const flatTopics: (TopicStat & { courseSlug: CourseSlug })[] = [];
  for (const slug of slugs) {
    const s = byCourse[slug];
    totalAttempts += s.totalAttempts;
    totalQuestions += s.totalQuestions;
    totalCorrect += s.totalCorrect;
    for (const t of s.topics) {
      if (t.total >= 3) flatTopics.push({ ...t, courseSlug: slug });
    }
  }

  const strongest = [...flatTopics]
    .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)
    .slice(0, 3);
  const weakest = [...flatTopics]
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, 3);

  return {
    totalAttempts,
    totalQuestions,
    totalCorrect,
    overallAccuracy:
      totalQuestions === 0
        ? 0
        : Math.round((totalCorrect / totalQuestions) * 100),
    byCourse,
    strongest,
    weakest,
  };
}

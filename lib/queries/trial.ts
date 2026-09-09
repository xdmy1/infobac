import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CourseSlug } from "@/lib/content/courses";
import { isTrialOfferOpen } from "@/lib/content";

type Client = SupabaseClient<Database>;

export interface TrialStatus {
  /** True while the offer window in lib/content.ts is still open. */
  offerOpen: boolean;
  /** The caller has never started a trial and holds no live access. */
  eligible: boolean;
  /** Set once a trial has been started, whether it is still running or not. */
  startedAt: string | null;
  endsAt: string | null;
  /** The chosen module, when a trial exists. */
  courseSlug: CourseSlug | null;
  /** A trial that has been started and has not run out yet. */
  isRunning: boolean;
  /** Whole days left, rounded up. 0 once it has lapsed. */
  daysLeft: number;
}

/**
 * The "say nothing" state: no offer, no eligibility, no countdown. Used for a
 * signed-out caller and as the fallback when the read fails, so a database
 * hiccup hides the banner rather than promising access we cannot grant.
 */
export const TRIAL_UNKNOWN: TrialStatus = {
  offerOpen: false,
  eligible: false,
  startedAt: null,
  endsAt: null,
  courseSlug: null,
  isRunning: false,
  daysLeft: 0,
};

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * Everything the UI needs to decide between "offer the trial", "count down the
 * days left" and "say nothing at all".
 *
 * Eligibility is answered optimistically here — it drives what the page shows,
 * not what the student gets. `start_free_trial` re-checks every condition
 * inside the database, so a stale read can only ever cost a friendly error.
 */
export async function getTrialStatus(client: Client): Promise<TrialStatus> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return TRIAL_UNKNOWN;

  const now = new Date();
  const offerOpen = isTrialOfferOpen(now);

  const { data: trial } = await client
    .from("trials")
    .select("course_id, started_at, ends_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (trial) {
    const endsAt = trial.ends_at;
    const isRunning = new Date(endsAt).getTime() > now.getTime();

    // The slug rather than the id, so callers can link straight to the course.
    const { data: course } = await client
      .from("courses")
      .select("slug")
      .eq("id", trial.course_id)
      .maybeSingle();

    return {
      offerOpen,
      eligible: false,
      startedAt: trial.started_at,
      endsAt,
      courseSlug: (course?.slug as CourseSlug | undefined) ?? null,
      isRunning,
      daysLeft: isRunning ? daysBetween(now, new Date(endsAt)) : 0,
    };
  }

  // No trial yet. Live access of any kind means there is nothing to try out,
  // which is the same rule the database enforces.
  const { count } = await client
    .from("course_access")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .or(`expires_at.is.null,expires_at.gt.${now.toISOString()}`);

  return {
    offerOpen,
    eligible: offerOpen && (count ?? 0) === 0,
    startedAt: null,
    endsAt: null,
    courseSlug: null,
    isRunning: false,
    daysLeft: 0,
  };
}

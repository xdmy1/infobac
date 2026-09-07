import posthog from "posthog-js";
import type { PlanId } from "@/lib/content";

/**
 * The named events, with the shape of what each one carries.
 *
 * Pageviews, referrers, search terms, UTM tags, clicks and time-on-page are
 * captured automatically (see instrumentation-client.ts) — those answer "where
 * did they come from and where did they go". These are the moments where the
 * answer has to be exact rather than inferred from a URL: the point someone
 * decided to make an account, and every step between that and paying.
 */
export interface AnalyticsEvents {
  /** A signup call-to-action was pressed. `from_path` is the page it was on — the "where did they decide" answer. */
  signup_cta_clicked: { location: string; from_path: string; plan?: PlanId };
  /** The signup form was submitted. */
  signup_started: { plan?: PlanId };
  /** An account now exists. */
  signup_completed: { plan?: PlanId; needs_parental_consent: boolean };
  login_completed: Record<string, never>;
  /** A plan's button on the pricing cards. `location` separates the landing section from /preturi. */
  plan_cta_clicked: { plan: PlanId; location: string; from_path: string };
  /** Sent to the provider's hosted checkout. */
  checkout_started: { plan: PlanId; amount_mdl: number };
  /** Paid. Also emitted server-side from the webhook, which is the reliable one. */
  checkout_completed: { plan: PlanId; amount_mdl: number };
  /** Someone opened a lesson they do not have access to. The clearest "why they did not pay yet" signal we have. */
  paywall_hit: { course: string; lesson_order: number };
  lesson_opened: { course: string; lesson_order: number; is_preview: boolean };
  quiz_finished: { course: string; score_percent: number };
  subscription_canceled: { plan: PlanId | null };
}

/**
 * Records an event, or does nothing at all when analytics is not configured
 * (local development, preview deploys) or when the visitor has opted out.
 * Never let measurement throw into a user flow.
 */
export function track<K extends keyof AnalyticsEvents>(
  event: K,
  properties: AnalyticsEvents[K],
): void {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics is never worth an error in front of a student.
  }
}

/**
 * Ties everything this browser has already done — every anonymous pageview
 * back to the first landing — to the person who just signed in. This is what
 * makes "what were they reading before they made an account" answerable.
 */
export function identifyUser(
  userId: string,
  properties?: { email?: string; name?: string },
): void {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(userId, properties);
  } catch {
    /* ignore */
  }
}

/** On sign-out, so the next person on a shared computer is not the same person. */
export function resetIdentity(): void {
  if (typeof window === "undefined") return;
  try {
    posthog.reset();
  } catch {
    /* ignore */
  }
}

/** The current page path, for events that record where someone came from. */
export function currentPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname + window.location.search;
}

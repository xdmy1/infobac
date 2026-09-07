import "server-only";
import { PostHog } from "posthog-node";
import type { AnalyticsEvents } from "./events";

/**
 * Server-side analytics, for the events that must not be lost.
 *
 * A payment confirmation arrives as a webhook — there is no browser to fire it
 * from — and an ad blocker or a closed tab must never be the reason revenue is
 * missing from the funnel. Everything behavioural stays on the client; this is
 * for facts.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let client: PostHog | null = null;

function getClient(): PostHog | null {
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, { host: "https://eu.i.posthog.com" });
  }
  return client;
}

/**
 * Records an event against a known user and waits for it to be sent.
 *
 * Deliberately the awaiting variant: on serverless the function can be frozen
 * the instant the response is returned, which drops anything still queued.
 * Never throws — a failed measurement must not fail a payment.
 */
export async function trackServer<K extends keyof AnalyticsEvents>(
  userId: string,
  event: K,
  properties: AnalyticsEvents[K],
): Promise<void> {
  const posthog = getClient();
  if (!posthog) return;
  try {
    await posthog.captureImmediate({
      distinctId: userId,
      event,
      properties,
    });
  } catch (err) {
    console.warn("[analytics] server capture failed:", err);
  }
}

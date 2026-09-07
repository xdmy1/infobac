import type { Database } from "@/lib/supabase/types";

type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];

/**
 * What a subscription row means right now — the stored `status` is not enough
 * on its own, because nothing sweeps rows to 'expired' when their period ends.
 */
export type SubscriptionState = SubscriptionRow["status"] | "expired";

/**
 * Cancelled wins over lapsed: "you cancelled this" stays true after the period
 * runs out, and it is the more useful thing to show. Everything else is judged
 * by the clock, so an 'active' row whose period ended reads as expired instead
 * of claiming a renewal that will never come.
 */
export function subscriptionState(
  sub: Pick<SubscriptionRow, "status" | "current_period_end">,
  now: number = Date.now(),
): SubscriptionState {
  if (sub.status === "canceled") return "canceled";
  const end = sub.current_period_end
    ? new Date(sub.current_period_end).getTime()
    : null;
  return end !== null && !Number.isNaN(end) && end <= now
    ? "expired"
    : sub.status;
}

/** Romanian label for each state. Shared by /abonament and the admin views. */
export const SUBSCRIPTION_STATE_LABEL: Record<SubscriptionState, string> = {
  active: "Activ",
  trialing: "Activ",
  canceled: "Anulat",
  expired: "Expirat",
};

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type SubscriptionRow =
  Database["public"]["Tables"]["subscriptions"]["Row"];

/**
 * The subscription that currently governs the caller's access, if any.
 *
 * "Currently governs" is not the same as `status = 'active'`:
 *
 *  - a cancelled plan still governs until the period the student paid for
 *    runs out, and the UI has to say so — dropping it here is what made a
 *    cancelled account read as "Niciun abonament activ";
 *  - an 'active' row whose period has already ended governs nothing. Nothing
 *    sweeps rows to 'expired', so without the date filter the card promised a
 *    renewal that was never coming.
 *
 * Callers can therefore treat a returned row as live, and read
 * `status === "canceled"` as "live, but not renewing".
 */
export async function getCurrentSubscription(
  client: Client,
): Promise<SubscriptionRow | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const nowIso = new Date().toISOString();

  // Admin policies on subscriptions let admins read all rows. Filter
  // explicitly so the dashboard "your subscription" card doesn't pick up
  // someone else's row when the caller is an admin.
  const { data, error } = await client
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing", "canceled"])
    .or(`current_period_end.is.null,current_period_end.gt.${nowIso}`)
    .order("plan", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * All subscription rows for the current user (history).
 */
export async function getAllSubscriptions(client: Client) {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return [];

  const { data, error } = await client
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

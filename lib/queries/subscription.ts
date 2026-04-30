import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type SubscriptionRow =
  Database["public"]["Tables"]["subscriptions"]["Row"];

/**
 * Current active or trialing subscription, if any.
 * Returns the highest-tier active row when multiple exist.
 */
export async function getActiveSubscription(
  client: Client
): Promise<SubscriptionRow | null> {
  const { data, error } = await client
    .from("subscriptions")
    .select("*")
    .in("status", ["active", "trialing"])
    .order("plan", { ascending: false }) // 'standard' < 'lifetime' alphabetically; tweak if needed
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * All subscription rows for the current user (history).
 */
export async function getAllSubscriptions(client: Client) {
  const { data, error } = await client
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

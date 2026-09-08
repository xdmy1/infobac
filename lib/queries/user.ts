import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentProfile(
  client: Client
): Promise<ProfileRow | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  // Filter explicitly by id — admins (per migration 0006) can see every
  // profile via profiles_select_admin, so we can't rely on RLS to narrow
  // down to the caller's row.
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * The signed-in user, or null.
 *
 * Supabase reports a signed-out visitor as an `AuthSessionMissingError`
 * rather than an empty result. Rethrowing that turned every (app) route into
 * a 500 for anyone not logged in — including crawlers — instead of the
 * redirect to /login the layouts are written to perform. No caller of this
 * function can do anything with an auth error except treat it as "no user",
 * so that is what it returns.
 */
export async function getCurrentUser(client: Client) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    if (error.name !== "AuthSessionMissingError") {
      // Anything else — a network blip, a malformed cookie — still means we
      // have no user, but it is worth seeing in the logs.
      console.warn("[auth] getUser failed:", error.message);
    }
    return null;
  }

  return user;
}

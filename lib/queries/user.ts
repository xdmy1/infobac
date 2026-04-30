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

export async function getCurrentUser(client: Client) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error) throw error;
  return user;
}

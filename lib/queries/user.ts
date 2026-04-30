import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentProfile(
  client: Client
): Promise<ProfileRow | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .maybeSingle(); // RLS: profiles_select_own already filters to current user

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

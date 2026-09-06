import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServiceRoleConfigured = Boolean(url && serviceRoleKey);

/**
 * Service-role Supabase client — bypasses RLS entirely.
 *
 * Only for server-side flows that have no user session to act on behalf of,
 * i.e. the Creem webhook at app/api/webhooks/creem. Everything that runs
 * inside a request from a logged-in user must keep using
 * `lib/supabase/server.ts` so RLS still applies.
 *
 * Never import this from a Client Component — `server-only` makes that a
 * build error rather than a leaked key.
 */
export function createAdminClient() {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY " +
        "in your environment — required for the payment webhook.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Browser-side Supabase client — use in Client Components only.
 * Throws a clear error at call time (not import time) if env vars are missing,
 * so the marketing site builds and runs without Supabase configured.
 */
export function createClient() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local. See README → Setup."
    );
  }
  return createBrowserClient<Database>(url, anonKey);
}

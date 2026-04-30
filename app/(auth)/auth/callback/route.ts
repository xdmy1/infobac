import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth + email confirmation callback.
 *
 * Supabase redirects here after:
 *  - Google OAuth flow completes
 *  - User clicks the email confirmation link
 *  - User clicks the password-reset link
 *
 * Query params:
 *  - `code` (PKCE code, exchanged for a session)
 *  - `next` (optional path to redirect to; defaults to /dashboard)
 *  - `error_description` (Supabase error if anything went wrong)
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const errorDescription = url.searchParams.get("error_description");

  const safeNext = next.startsWith("/") ? next : "/dashboard";
  const origin = url.origin;

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?auth_error=${encodeURIComponent(errorDescription)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?auth_error=missing_code`);
  }

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(
      `${origin}/login?supabase_missing=1`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?auth_error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}

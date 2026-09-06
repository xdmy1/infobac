import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

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
 *
 * The Supabase client here writes its cookies straight onto the redirect
 * response we are about to return, instead of going through `cookies()` from
 * next/headers. That matters: a response built separately does not
 * necessarily carry cookies staged on the request-scoped store, so the
 * freshly exchanged session could be dropped on the way out. The user then
 * landed on /dashboard with no session, middleware bounced them to /login,
 * and only the second attempt appeared to work — because by then the session
 * cookie from the first one had finally been written.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const errorDescription = url.searchParams.get("error_description");

  const safeNext = next.startsWith("/") ? next : "/dashboard";
  const origin = requestOrigin(request, url);

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?auth_error=${encodeURIComponent(errorDescription)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?auth_error=missing_code`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return NextResponse.redirect(`${origin}/login?supabase_missing=1`);
  }

  // Build the success response first so the client can write onto it.
  const response = NextResponse.redirect(`${origin}${safeNext}`);

  const supabase = createServerClient<Database>(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?auth_error=${encodeURIComponent(error.message)}`,
    );
  }

  return response;
}

/**
 * Origin to redirect back to. Behind Vercel's proxy `request.url` carries the
 * internal host, which would send the user to a URL their session cookie was
 * never set for — so the forwarded headers win when present.
 */
function requestOrigin(request: NextRequest, url: URL): string {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return url.origin;

  const proto =
    request.headers.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

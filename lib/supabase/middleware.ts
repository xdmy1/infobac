import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const previewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "1";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/curs",
  "/quiz",
  "/progres",
  "/abonament",
  "/setari",
];

const AUTH_ONLY_PREFIXES = ["/login", "/inregistrare"];

function isPathProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthOnly(pathname: string) {
  return AUTH_ONLY_PREFIXES.some((p) => pathname === p);
}

/**
 * Refresh the Supabase session and gate (app)/* routes.
 *
 * Called by middleware.ts on every matching request.
 * Falls through (no auth checks) if Supabase isn't configured — keeps the
 * marketing site working without a real Supabase project.
 */
export async function updateSession(request: NextRequest) {
  if (!url || !anonKey) {
    if (isPathProtected(request.nextUrl.pathname)) {
      if (previewMode) {
        // Preview mode: let the page render with mock data instead of
        // bouncing to /login. The (app) layout reads the same flag and
        // skips the real Supabase fetch.
        return NextResponse.next({ request });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set(
        "supabase_missing",
        "1"
      );
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: do not move getUser() — it validates the JWT and writes a
  // refreshed session cookie into `response`. Removing it breaks auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isPathProtected(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthOnly(pathname) && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

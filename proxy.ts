import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - ingest (the first-party analytics proxy — a session refresh on every
     *   captured event would be pure waste, and these are not user navigations)
     * - any file with an extension (image, font, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ingest|.*\\..*).*)",
  ],
};

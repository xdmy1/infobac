import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { listAllPosts } from "@/lib/blog";
import { pingIndexNow } from "@/lib/seo/indexnow";

/**
 * One-shot launch endpoint. Hit it once after deploy to push every public URL
 * into Bing + Yandex's index immediately:
 *
 *   curl "https://infobac.md/api/seo/ping-indexnow?token=$INDEXNOW_PING_TOKEN"
 *
 * Guarded by INDEXNOW_PING_TOKEN to prevent abuse. Returns the URL count and
 * IndexNow's response status.
 */
export async function GET(request: Request) {
  const token = process.env.INDEXNOW_PING_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "INDEXNOW_PING_TOKEN not configured" },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  if (url.searchParams.get("token") !== token) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const base = siteConfig.url;
  const staticPaths = [
    "",
    "/preturi",
    "/cursuri",
    "/blog",
    "/faq",
    "/despre",
    "/contact",
  ];
  const posts = await listAllPosts();
  const urls = [
    ...staticPaths.map((p) => `${base}${p}`),
    ...posts.map((p) => `${base}/blog/${p.slug}`),
  ];

  const result = await pingIndexNow(urls);
  return NextResponse.json({
    ok: result.ok,
    pinged: urls.length,
    status: result.status ?? null,
    reason: result.reason ?? null,
  });
}

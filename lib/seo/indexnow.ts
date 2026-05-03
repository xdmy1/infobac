import "server-only";
import { siteConfig } from "@/lib/site";

/**
 * IndexNow — Bing/Yandex/Seznam protocol for instant indexing. Sending a
 * request here tells the search engine "fetch these URLs *now*", which beats
 * waiting for the next crawl by days-to-weeks. Critical for a brand-new
 * domain that has no crawl budget yet.
 *
 * Setup:
 *   1. Generate a random key (any 8–128 hex chars):
 *        node -e "console.log(crypto.randomBytes(16).toString('hex'))"
 *   2. Set INDEXNOW_KEY in the production env.
 *   3. The route at /api/indexnow-key serves the key as plain text — Bing
 *      uses this to verify ownership.
 *
 * Then call `pingIndexNow([...urls])` from anywhere server-side (e.g. after
 * publishing a blog post, or from a one-shot script at launch).
 */

export const indexNowKeyLocation = `${siteConfig.url}/api/indexnow-key`;

const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function pingIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status?: number;
  reason?: string;
}> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return { ok: false, reason: "INDEXNOW_KEY not configured" };
  }
  if (urls.length === 0) {
    return { ok: false, reason: "no urls" };
  }

  const host = new URL(siteConfig.url).host;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: indexNowKeyLocation,
        urlList: urls,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}

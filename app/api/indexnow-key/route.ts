/**
 * Serves the IndexNow verification key as plain text. Bing/Yandex fetch
 * `https://infobac.md/api/indexnow-key` and compare with the `key` field in
 * the IndexNow POST body. Set INDEXNOW_KEY in env to enable.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new Response("not configured", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

import { siteConfig } from "@/lib/site";
import { listAllPosts } from "@/lib/blog";

/**
 * RSS 2.0 feed for the blog. Linked from the blog index via
 * `<link rel="alternate" type="application/rss+xml">`. RSS aggregators pick
 * this up and crosslink articles, sending freshness signals + occasional
 * backlinks. Cached for an hour at the edge.
 */
export const revalidate = 3600;

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await listAllPosts();
  const base = siteConfig.url;
  const lastBuildDate = posts[0]
    ? new Date(posts[0].updatedAt).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${base}/blog/${p.slug}`;
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
      <author>noreply@infobac.md (${escape(p.author)})</author>
      <category>${escape(p.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${siteConfig.fullName} — Blog`)}</title>
    <link>${escape(`${base}/blog`)}</link>
    <atom:link href="${escape(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>${escape(siteConfig.description)}</description>
    <language>ro-MD</language>
    <copyright>${escape(`© ${new Date().getFullYear()} ${siteConfig.fullName}`)}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>infobac.md</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

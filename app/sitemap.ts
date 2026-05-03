import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listAllPosts } from "@/lib/blog";

/**
 * Public-facing sitemap. We deliberately exclude:
 *  - /(auth)/*  (login, signup, callback) — gated content, no SEO value
 *  - /(app)/*   (dashboard, curs, quiz)  — auth-only, indexable would 401
 *  - /api/*     — JSON endpoints
 *
 * Blog posts are appended dynamically with lastModified from frontmatter so
 * editing an article sends a fresh-content signal to crawlers. Each entry
 * declares an `ro-MD` hreflang so Google understands this is the Moldova
 * Romanian variant.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const ogFallback = `${base}${siteConfig.ogImage}`;

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "yearly" | "monthly" | "weekly" | "daily";
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/preturi", priority: 0.95, changeFrequency: "monthly" },
    { path: "/cursuri", priority: 0.95, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.85, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.75, changeFrequency: "monthly" },
    { path: "/despre", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal/termeni", priority: 0.3, changeFrequency: "yearly" },
    {
      path: "/legal/confidentialitate",
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];

  const posts = await listAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    const url = `${base}/blog/${p.slug}`;
    return {
      url,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly",
      priority: p.isPillar ? 0.85 : 0.7,
      alternates: { languages: { "ro-MD": url } },
      images: [p.ogImage ? `${base}${p.ogImage}` : ogFallback],
    };
  });

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => {
      const url = `${base}${path}`;
      return {
        url,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: { languages: { "ro-MD": url } },
      };
    }),
    ...postEntries,
  ];
}

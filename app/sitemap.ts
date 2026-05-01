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
 * editing an article sends a fresh-content signal to crawlers.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "yearly" | "monthly" | "weekly";
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/preturi", priority: 0.9, changeFrequency: "monthly" },
    { path: "/cursuri", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
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
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly",
    priority: p.isPillar ? 0.8 : 0.7,
  }));

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...postEntries,
  ];
}

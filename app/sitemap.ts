import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Public-facing sitemap. We deliberately exclude:
 *  - /(auth)/*  (login, signup, callback) — gated content, no SEO value
 *  - /(app)/*   (dashboard, curs, quiz)  — auth-only, indexable would 401
 *  - /api/*     — JSON endpoints
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: "yearly" | "monthly" | "weekly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/preturi", priority: 0.9, changeFrequency: "monthly" },
    { path: "/cursuri", priority: 0.9, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/despre", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal/termeni", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/confidentialitate", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

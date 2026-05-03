import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Per Google's robots.txt spec, `Disallow: /curs/` (with trailing slash)
 * should NOT match `/cursuri` — character-prefix match requires a literal
 * `/` after `curs`. We list `/cursuri` (and other public marketing pages)
 * in `Allow:` anyway so:
 *   1. If a crawler interprets the rules more aggressively (or has a stale
 *      cached robots.txt), the explicit longer `Allow` wins on specificity.
 *   2. The intent stays obvious to anyone reading the file.
 */
const PUBLIC_ALLOWS = [
  "/",
  "/cursuri",
  "/preturi",
  "/blog",
  "/faq",
  "/despre",
  "/contact",
  "/legal",
];

const PRIVATE_PATHS = [
  "/api/",
  "/auth/",
  "/dashboard",
  "/dashboard/",
  "/curs/",
  "/quiz/",
  "/progres",
  "/abonament",
  "/setari",
  "/admin",
  "/admin/",
  "/login",
  "/inregistrare",
  "/resetare-parola",
  "/confirmare-email",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: PUBLIC_ALLOWS, disallow: PRIVATE_PATHS },
      { userAgent: "Googlebot", allow: PUBLIC_ALLOWS, disallow: PRIVATE_PATHS },
      { userAgent: "Googlebot-Image", allow: PUBLIC_ALLOWS, disallow: PRIVATE_PATHS },
      { userAgent: "Bingbot", allow: PUBLIC_ALLOWS, disallow: PRIVATE_PATHS },
      { userAgent: "Yandex", allow: PUBLIC_ALLOWS, disallow: PRIVATE_PATHS },
      { userAgent: "DuckDuckBot", allow: PUBLIC_ALLOWS, disallow: PRIVATE_PATHS },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

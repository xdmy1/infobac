import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

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
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "Googlebot", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "Googlebot-Image", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "Bingbot", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "Yandex", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "DuckDuckBot", allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

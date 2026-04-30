import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/dashboard",
          "/dashboard/",
          "/curs/",
          "/quiz/",
          "/progres",
          "/abonament",
          "/setari",
          "/login",
          "/inregistrare",
          "/resetare-parola",
          "/confirmare-email",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

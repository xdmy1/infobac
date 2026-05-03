import path from "node:path";
import type { NextConfig } from "next";

/**
 * Security + indexing-friendly response headers. None of these block
 * crawlers; they're trust signals that Google factors into Page Experience
 * (and that show up in Lighthouse's Best Practices score).
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Default is 1 MB. Payment-proof screenshots from phones are routinely
      // 1–4 MB, so anything past 1 MB used to fail silently with a 413.
      bodySizeLimit: "8mb",
    },
  },
  async headers() {
    return [
      {
        // Apply security headers to every response.
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Long-cache the dynamic OG image — it changes only on deploy.
        source: "/opengraph-image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/rss.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

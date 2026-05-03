import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OG image used when a page doesn't override its own.
 * Generated at the edge, no static asset to commit.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#fafaf9",
          backgroundImage:
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(79,70,229,0.12), transparent), radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)",
          backgroundSize: "auto, 24px 24px",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "#0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#65a30d",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            &gt;
          </span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            infobac
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Făcut în Chișinău, Moldova
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              maxWidth: "85%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <span style={{ color: "#84cc16" }}>10</span>
            <span>din oficiu la BAC informatică.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#64748b",
              fontWeight: 500,
              maxWidth: "75%",
            }}
          >
            Fără să dai 1.000 EUR. Fără să pierzi 10 luni.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span>✓ Pregătire BAC informatică</span>
            <span>✓ 3 certificări Certiport</span>
          </div>
          <div style={{ fontWeight: 700, color: "#0f172a" }}>infobac.md</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

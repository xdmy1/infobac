// =============================================================================
// Email design tokens — duplicated from globals.css because email clients
// strip/ignore CSS variables and external stylesheets. All colors are
// expressed as plain hex strings.
// =============================================================================

export const emailBrand = {
  colors: {
    background: "#fafaf9",
    surface: "#ffffff",
    foreground: "#0f172a",
    mutedForeground: "#64748b",
    border: "#e2e8f0",
    primary: "#4f46e5",
    primaryForeground: "#ffffff",
    accent: "#84cc16",
    accentDark: "#65a30d",
    success: "#10b981",
    warning: "#f59e0b",
    destructive: "#ef4444",
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  containerMaxWidth: "560px",
} as const;

export type EmailBrand = typeof emailBrand;

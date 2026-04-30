/**
 * Subtle film-grain noise overlay — pure CSS, zero JS.
 * Uses an inline SVG turbulence filter encoded as a data URI.
 * Place as absolute child with low opacity for a tactile feel.
 */
export function NoiseOverlay({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")",
        backgroundSize: "200px 200px",
      }}
    />
  );
}

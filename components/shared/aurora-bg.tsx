/**
 * Animated mesh gradient background — pure CSS, zero JS runtime.
 * 3 radial-gradient blobs drift slowly via transform; CSS compositor
 * handles it on the GPU without continuous re-render.
 *
 * Replaces the WebGL r3f version we had earlier — same visual story,
 * ~500KB lighter bundle + no continuous GPU work.
 */
interface AuroraBackgroundProps {
  className?: string;
  /** 0..1 — overall opacity multiplier. */
  intensity?: number;
}

export function AuroraBackground({
  className,
  intensity = 0.55,
}: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: intensity,
      }}
    >
      <style>{`
        @keyframes aurora-drift-1 {
          0%   { transform: translate(-8%, -6%) scale(1.05); }
          50%  { transform: translate(6%, 4%) scale(1.10); }
          100% { transform: translate(-4%, -2%) scale(1.05); }
        }
        @keyframes aurora-drift-2 {
          0%   { transform: translate(10%, -4%) scale(1.00); }
          50%  { transform: translate(-6%, 8%) scale(1.08); }
          100% { transform: translate(8%, -2%) scale(1.00); }
        }
        @keyframes aurora-drift-3 {
          0%   { transform: translate(-2%, 8%) scale(1.02); }
          50%  { transform: translate(8%, -6%) scale(1.06); }
          100% { transform: translate(-4%, 4%) scale(1.02); }
        }
        .aurora-blob {
          position: absolute;
          inset: -20%;
          will-change: transform;
          filter: blur(60px);
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none !important; }
        }
      `}</style>

      <div
        className="aurora-blob"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 25% 30%, #4f46e5 0%, transparent 65%)",
          animation: "aurora-drift-1 22s ease-in-out infinite alternate",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 75% 70%, #84cc16 0%, transparent 65%)",
          animation: "aurora-drift-2 28s ease-in-out infinite alternate",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, #6366f1 0%, transparent 60%)",
          animation: "aurora-drift-3 32s ease-in-out infinite alternate",
        }}
      />

      {/* Vignette — fade edges into the page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at center, transparent 30%, var(--background) 95%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

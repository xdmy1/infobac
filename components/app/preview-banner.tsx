import { Eye } from "lucide-react";

export function PreviewBanner() {
  return (
    <div
      role="status"
      className="border-b border-warning/40 bg-warning/10 px-4 py-2 text-center md:px-6"
    >
      <p className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
        <Eye className="size-3.5 text-warning" />
        <span>
          <strong>Mod Preview</strong> — date demo, nu sunt reale. Dezactivezi
          setând{" "}
          <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-[11px]">
            NEXT_PUBLIC_PREVIEW_MODE=0
          </code>{" "}
          în <code className="font-mono text-[11px]">.env.local</code>.
        </span>
      </p>
    </div>
  );
}

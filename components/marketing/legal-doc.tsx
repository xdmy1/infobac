import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalDocProps {
  title: string;
  /** Format ISO sau text liber: "2026-04-01" sau "În curs de finalizare". */
  lastUpdated: string;
  /** Etichetă de status (Draft / Final / În revizie). */
  status?: "draft" | "final";
  children: React.ReactNode;
}

export function LegalDoc({
  title,
  lastUpdated,
  status = "draft",
  children,
}: LegalDocProps) {
  return (
    <>
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Document legal
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              Ultima actualizare:{" "}
              <span className="font-medium text-foreground">
                {lastUpdated}
              </span>
            </span>
            <span aria-hidden>·</span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                status === "draft"
                  ? "bg-warning/15 text-warning"
                  : "bg-success/15 text-success"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status === "draft" ? "bg-warning" : "bg-success"
                )}
                aria-hidden
              />
              {status === "draft" ? "Draft" : "Final"}
            </span>
          </div>
        </div>
      </section>

      {status === "draft" && (
        <section className="border-y border-warning/30 bg-warning/5">
          <div className="mx-auto max-w-3xl px-4 py-4 md:px-6 lg:px-8">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 size-5 shrink-0 text-warning"
                aria-hidden
              />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Document în lucru.</span>{" "}
                Acest text e un draft pentru transparență publică. Va fi
                revizuit și finalizat de un consultant juridic specializat în
                drept digital din Republica Moldova înainte de lansarea
                comercială.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <article
            className={cn(
              "space-y-10",
              "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:scroll-mt-20",
              "[&_h2]:mb-3 [&_h2]:mt-0",
              "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight",
              "[&_h3]:mt-6 [&_h3]:mb-2",
              "[&_p]:text-base [&_p]:leading-relaxed [&_p]:text-muted-foreground",
              "[&_p]:text-pretty",
              "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
              "[&_a:hover]:text-primary",
              "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6",
              "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6",
              "[&_li]:text-base [&_li]:leading-relaxed [&_li]:text-muted-foreground",
              "[&_strong]:font-semibold [&_strong]:text-foreground",
              "[&_section>*+*]:mt-3"
            )}
          >
            {children}
          </article>
        </div>
      </section>
    </>
  );
}

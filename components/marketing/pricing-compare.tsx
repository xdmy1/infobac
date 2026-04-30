import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { comparisonMatrix, type ComparisonFeatureRow } from "@/lib/content";

const categoryLabels: Record<ComparisonFeatureRow["category"], string> = {
  content: "Conținut",
  exam: "Pregătire examen",
  support: "Suport",
  perks: "Beneficii suplimentare",
};

const groupedFeatures = (() => {
  const groups: Record<
    ComparisonFeatureRow["category"],
    ComparisonFeatureRow[]
  > = { content: [], exam: [], support: [], perks: [] };
  for (const row of comparisonMatrix) {
    groups[row.category].push(row);
  }
  return groups;
})();

export function PricingCompare() {
  return (
    <section className="border-t border-border py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Compare planurile cu detalii.
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            Toate au același conținut. Diferența e în pregătirea pentru
            examen, suport și durată.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border md:mt-16">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="w-[40%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Un modul
                    <span className="block text-[10px] font-normal text-muted-foreground/70">
                      250 MDL/lună
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="bg-primary/5 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-primary"
                  >
                    Toate
                    <span className="block text-[10px] font-normal text-primary/70">
                      550 MDL/lună
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    6 luni
                    <span className="block text-[10px] font-normal text-muted-foreground/70">
                      950 MDL
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  Object.keys(groupedFeatures) as Array<
                    keyof typeof groupedFeatures
                  >
                ).map((cat) => (
                  <CategoryGroup
                    key={cat}
                    label={categoryLabels[cat]}
                    rows={groupedFeatures[cat]}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGroup({
  label,
  rows,
}: {
  label: string;
  rows: ComparisonFeatureRow[];
}) {
  return (
    <>
      <tr className="border-y border-border bg-muted/20">
        <th
          colSpan={4}
          scope="rowgroup"
          className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-foreground"
        >
          {label}
        </th>
      </tr>
      {rows.map((row, i) => (
        <tr
          key={i}
          className="border-b border-border last:border-b-0 hover:bg-muted/10"
        >
          <td className="px-4 py-3.5 text-foreground">{row.label}</td>
          <FeatureCell value={row.module} />
          <FeatureCell value={row.all} highlighted />
          <FeatureCell value={row.semester} />
        </tr>
      ))}
    </>
  );
}

function FeatureCell({
  value,
  highlighted = false,
}: {
  value: boolean | string;
  highlighted?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3.5 text-center",
        highlighted && "bg-primary/5"
      )}
    >
      {value === true ? (
        <Check
          aria-label="Inclus"
          className={cn(
            "mx-auto size-4",
            highlighted ? "text-primary" : "text-success"
          )}
          strokeWidth={2.5}
        />
      ) : value === false ? (
        <Minus
          aria-label="Nu este inclus"
          className="mx-auto size-4 text-muted-foreground/40"
        />
      ) : (
        <span
          className={cn(
            "font-mono text-xs font-medium tabular-nums",
            highlighted ? "text-primary" : "text-foreground"
          )}
        >
          {value}
        </span>
      )}
    </td>
  );
}

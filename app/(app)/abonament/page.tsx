import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crown, Sparkles, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SubscriptionStatusCard } from "@/components/app/subscription-status-card";
import { createClient } from "@/lib/supabase/server";
import {
  getActiveSubscription,
  getAllSubscriptions,
  type SubscriptionRow,
} from "@/lib/queries/subscription";
import { isPreviewMode, previewSubscription } from "@/lib/preview-mode";
import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Abonament",
  robots: { index: false, follow: false },
};

const PLAN_LABEL: Record<SubscriptionRow["plan"], string> = {
  module: "Un modul",
  all: "Toate modulele",
  semester: "Pachet 6 luni",
};

const STATUS_LABEL: Record<SubscriptionRow["status"], string> = {
  active: "Activ",
  trialing: "Activ",
  canceled: "Anulat",
  expired: "Expirat",
};

const STATUS_BADGE: Record<SubscriptionRow["status"], string> = {
  active: "bg-success/15 text-success",
  trialing: "bg-primary/15 text-primary",
  canceled: "bg-muted text-muted-foreground",
  expired: "bg-destructive/15 text-destructive",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ro-MD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AbonamentPage() {
  let active: SubscriptionRow | null;
  let history: SubscriptionRow[];

  if (isPreviewMode) {
    active = previewSubscription;
    history = [previewSubscription];
  } else {
    const supabase = await createClient();
    const [a, h] = await Promise.all([
      getActiveSubscription(supabase).catch(() => null),
      getAllSubscriptions(supabase).catch(() => [] as SubscriptionRow[]),
    ]);
    active = a;
    history = h;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <Reveal staggerChildren={0.1}>
        <RevealItem variant="fade-up">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Abonament
          </p>
        </RevealItem>
        <RevealItem variant="fade-blur">
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Planul tău și plățile.
          </h1>
        </RevealItem>
      </Reveal>

      <Reveal variant="fade-up" delay={0.2}>
        <SubscriptionStatusCard subscription={active} />
      </Reveal>

      {active && active.plan !== "semester" && (
        <section className="rounded-2xl border border-accent/40 bg-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <Crown className="size-5" />
              </span>
              <div>
                <p className="text-base font-semibold">
                  Trec la pachetul de 6 luni.
                </p>
                <p className="text-sm text-muted-foreground">
                  950 MDL plată unică = ~158 MDL/lună. Mai ieftin decât
                  oricare plan lunar.
                </p>
              </div>
            </div>
            <Link
              href="/preturi"
              className={cn(
                buttonVariants(),
                "h-10 gap-1.5 px-4 text-sm font-medium"
              )}
            >
              Vezi pachetul
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Istoric
        </h2>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            Niciun abonament în istoric.
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-border bg-card">
            {history.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 md:px-5",
                  i !== history.length - 1 && "border-b border-border"
                )}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  {s.plan === "semester" ? (
                    <Crown className="size-4" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    Plan {PLAN_LABEL[s.plan]}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {formatDate(s.current_period_start)}
                    {s.current_period_end && ` → ${formatDate(s.current_period_end)}`}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                    STATUS_BADGE[s.status]
                  )}
                >
                  {STATUS_LABEL[s.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="text-sm text-muted-foreground">
          Pentru anulare, schimbare plan sau întrebări de facturare, scrie-ne
          pe{" "}
          <a
            href="mailto:hello@infobac.md"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            hello@infobac.md
          </a>
          . Refund 7 zile, fără întrebări.
        </p>
      </section>
    </div>
  );
}

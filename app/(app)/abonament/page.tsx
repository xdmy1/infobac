import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crown, Sparkles, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SubscriptionStatusCard } from "@/components/app/subscription-status-card";
import { SubscriptionManager } from "@/components/app/subscription-manager";
import { TrialCard } from "@/components/app/trial-card";
import { isCardCheckoutEnabled } from "@/lib/payments";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import {
  getCurrentSubscription,
  getAllSubscriptions,
  type SubscriptionRow,
} from "@/lib/queries/subscription";
import {
  getTrialStatus,
  TRIAL_UNKNOWN,
  type TrialStatus,
} from "@/lib/queries/trial";
import {
  subscriptionState,
  SUBSCRIPTION_STATE_LABEL,
  type SubscriptionState,
} from "@/lib/subscription-state";
import {
  isPreviewMode,
  previewSubscription,
  previewTrialStatus,
} from "@/lib/preview-mode";
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

const STATUS_BADGE: Record<SubscriptionState, string> = {
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
  let current: SubscriptionRow | null;
  let history: SubscriptionRow[];
  let trial: TrialStatus;

  if (isPreviewMode) {
    current = previewSubscription;
    history = [previewSubscription];
    trial = previewTrialStatus;
  } else {
    const supabase = await createClient();
    const [c, h, t] = await Promise.all([
      getCurrentSubscription(supabase).catch(() => null),
      getAllSubscriptions(supabase).catch(() => [] as SubscriptionRow[]),
      getTrialStatus(supabase).catch(() => TRIAL_UNKNOWN),
    ]);
    current = c;
    history = h;
    trial = t;
  }

  // `current` is only ever a live row, so a canceled status means "paid up
  // until the end date, not renewing" — the state the student needs spelled
  // out, in words, on the page they cancelled from.
  const isCanceled = current?.status === "canceled";
  const accessUntil = current ? formatDate(current.current_period_end) : "—";

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
        <SubscriptionStatusCard subscription={current} />
      </Reveal>

      <TrialCard status={trial} />

      {/* Self-service billing. Creem requires that a customer can cancel from
          inside the product rather than by contacting support. */}
      {isCardCheckoutEnabled && (
        <section
          className={cn(
            "rounded-2xl border bg-card p-5 md:p-6",
            isCanceled ? "border-destructive/40" : "border-border"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-base font-semibold">
                {isCanceled ? "Abonament anulat" : "Facturare și anulare"}
              </p>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                {isCanceled
                  ? `Nu se mai reînnoiește și cardul nu mai e taxat. Accesul rămâne activ până la ${accessUntil}, apoi se oprește. Te poți abona din nou oricând.`
                  : current
                    ? "Anulează abonamentul dintr-un clic. Accesul rămâne activ până la finalul perioadei deja plătite. Pentru schimbarea cardului sau facturi, deschide portalul procesatorului."
                    : "Nu ai un abonament activ de anulat. Pentru facturi sau schimbarea cardului, deschide portalul procesatorului."}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Ai nevoie de ajutor? Scrie-ne la{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  {siteConfig.contact.email}
                </a>
                .
              </p>
              {isCanceled && (
                <Link
                  href="/preturi"
                  className={cn(
                    buttonVariants(),
                    "mt-4 h-10 gap-1.5 px-4 text-sm font-medium"
                  )}
                >
                  Abonează-te din nou
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <SubscriptionManager
              canceled={isCanceled}
              hasSubscription={Boolean(current)}
            />
          </div>
        </section>
      )}

      {current && !isCanceled && current.plan !== "semester" && (
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
                  900 MDL plată unică = ~150 MDL/lună. Mai ieftin decât
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
            {history.map((s, i) => {
              const state = subscriptionState(s);
              return (
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
                    STATUS_BADGE[state]
                  )}
                >
                  {SUBSCRIPTION_STATE_LABEL[state]}
                </span>
              </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="text-sm text-muted-foreground">
          Pentru schimbarea planului sau întrebări de facturare, scrie-ne pe{" "}
          <a
            href="mailto:hello@infobac.md"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            hello@infobac.md
          </a>
          .
        </p>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Crown, Sparkles, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubscriptionRow } from "@/lib/queries/subscription";
import type { TrialStatus } from "@/lib/queries/trial";
import { allCoursesMeta } from "@/lib/content/courses";
import { freeTrial } from "@/lib/content";

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

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ro-MD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface SubscriptionStatusCardProps {
  subscription: SubscriptionRow | null;
  /** Omitted where the trial is irrelevant; a running one takes the card. */
  trial?: TrialStatus | null;
}

export function SubscriptionStatusCard({
  subscription,
  trial,
}: SubscriptionStatusCardProps) {
  // A running trial IS the student's current access, so it owns this card.
  // Falling through to "Niciun abonament activ" told someone who had just
  // pressed the button that nothing had happened.
  if (!subscription && trial?.isRunning) {
    const days = trial.daysLeft;
    const courseTitle = allCoursesMeta
      .find((c) => c.slug === trial.courseSlug)
      ?.title.split(" — ")[0];
    const until = formatDate(trial.endsAt);

    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-0 bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 200,
                delay: 0.2,
              }}
              className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary"
            >
              <Sparkles className="size-5" />
            </motion.span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Perioadă de probă
              </p>
              <p className="text-base font-semibold">
                {freeTrial.days} zile gratis
                {courseTitle ? ` · ${courseTitle}` : ""}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {days} {days === 1 ? "zi rămasă" : "zile rămase"}
                {until ? ` · acces până la ${until}` : ""} · fără card
              </p>
            </div>
          </div>
          <Link
            href="/preturi"
            className={cn(
              buttonVariants(),
              "h-10 gap-2 px-4 text-sm font-medium",
            )}
          >
            Vezi prețuri
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Abonament
            </p>
            <p className="mt-1 text-base font-semibold">
              Niciun abonament activ
            </p>
            <p className="text-sm text-muted-foreground">
              Alege un plan ca să-ți activăm cursurile.
            </p>
          </div>
          <Link
            href="/preturi"
            className={cn(
              buttonVariants(),
              "h-10 gap-2 px-4 text-sm font-medium"
            )}
          >
            Vezi prețuri
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  // The query only returns a row that is still live, so a canceled status
  // means "paid up until the end date, but not renewing" — never "no access".
  const isCanceled = subscription.status === "canceled";
  const isSemester = subscription.plan === "semester";
  const expires = formatDate(subscription.current_period_end);
  const Icon = isSemester ? Crown : Sparkles;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        isCanceled
          ? "border-border bg-card"
          : isSemester
            ? "border-accent/40 bg-card"
            : "border-primary/30 bg-card"
      )}
    >
      {/* A cancelled plan keeps the card, loses the glow — it is winding down. */}
      {!isCanceled && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-x-4 -inset-y-6 -z-0 blur-3xl",
            isSemester ? "bg-accent/20" : "bg-primary/15"
          )}
        />
      )}

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200,
              delay: 0.2,
            }}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-xl",
              isCanceled
                ? "bg-muted text-muted-foreground"
                : isSemester
                  ? "bg-accent/20 text-accent-foreground"
                  : "bg-primary/15 text-primary"
            )}
          >
            <Icon className="size-5" />
          </motion.span>
          <div>
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isCanceled ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {STATUS_LABEL[subscription.status]}
            </p>
            <p className="text-base font-semibold">
              Plan {PLAN_LABEL[subscription.plan]}
            </p>
            {expires && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {isCanceled
                  ? `Nu se reînnoiește · acces până la ${expires}`
                  : isSemester
                    ? `Acces până la ${expires}`
                    : `Următoarea reînnoire: ${expires}`}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/abonament"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 px-4 text-sm font-medium"
          )}
        >
          Gestionează
        </Link>
      </div>
    </div>
  );
}

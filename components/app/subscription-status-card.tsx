"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Crown, Sparkles, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubscriptionRow } from "@/lib/queries/subscription";

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
}

export function SubscriptionStatusCard({
  subscription,
}: SubscriptionStatusCardProps) {
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

  const isSemester = subscription.plan === "semester";
  const expires = formatDate(subscription.current_period_end);
  const Icon = isSemester ? Crown : Sparkles;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        isSemester
          ? "border-accent/40 bg-card"
          : "border-primary/30 bg-card"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-x-4 -inset-y-6 -z-0 blur-3xl",
          isSemester ? "bg-accent/20" : "bg-primary/15"
        )}
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
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-xl",
              isSemester
                ? "bg-accent/20 text-accent-foreground"
                : "bg-primary/15 text-primary"
            )}
          >
            <Icon className="size-5" />
          </motion.span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {STATUS_LABEL[subscription.status]}
            </p>
            <p className="text-base font-semibold">
              Plan {PLAN_LABEL[subscription.plan]}
            </p>
            {expires && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {isSemester
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

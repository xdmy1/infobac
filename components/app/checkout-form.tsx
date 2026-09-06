"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Lock, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import {
  VisaIcon,
  MastercardIcon,
  ApplePayIcon,
  GooglePayIcon,
} from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";
import { startCardCheckoutAction } from "@/lib/actions/checkout";
import { allCoursesMeta, type CourseSlug } from "@/lib/content/courses";
import { pricingPlans, type PlanId } from "@/lib/content";

interface CheckoutFormProps {
  plan: PlanId;
  amountMDL: number;
  /** Pre-selected course (only for the module plan, optional). */
  initialCourseSlug?: CourseSlug;
  /** Whether the user must pick a course (true for the module plan). */
  requiresCourseSelection: boolean;
  /** Creem sandbox — badge it so nobody mistakes a test charge for real. */
  cardTestMode?: boolean;
}

const marks = [
  { label: "Visa", Icon: VisaIcon },
  { label: "Mastercard", Icon: MastercardIcon },
  { label: "Apple Pay", Icon: ApplePayIcon },
  { label: "Google Pay", Icon: GooglePayIcon },
] as const;

export function CheckoutForm({
  plan,
  amountMDL,
  initialCourseSlug,
  requiresCourseSelection,
  cardTestMode = false,
}: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [courseSlug, setCourseSlug] = useState<CourseSlug | "">(
    initialCourseSlug ?? "",
  );

  const planData = pricingPlans.find((p) => p.id === plan);
  // "lună" | "6 luni" — mirrors the Creem product's billing period, so the
  // recurrence disclosure stays true for every plan.
  const priceUnit = planData?.priceUnit ?? "lună";

  const handleCheckout = () => {
    if (requiresCourseSelection && !courseSlug) {
      toast.error("Alege un curs înainte.");
      return;
    }

    startTransition(async () => {
      try {
        // On success the action redirects to the hosted checkout and this
        // promise never resolves — a returned value always means failure.
        const result = await startCardCheckoutAction({
          plan,
          courseSlug: requiresCourseSelection && courseSlug ? courseSlug : null,
        });
        if (result && !result.ok) toast.error(result.error);
      } catch (err) {
        console.warn("[checkout] card start failed:", err);
        toast.error("Nu am putut deschide plata. Reîncearcă în câteva minute.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {requiresCourseSelection && (
        <fieldset className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <legend className="px-2 text-sm font-bold">Alege cursul tău</legend>
          <p className="mb-3 text-xs text-muted-foreground">
            Cu planul de un modul, primești acces doar la cursul ales.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {allCoursesMeta.map((c) => {
              const selected = courseSlug === c.slug;
              return (
                <label
                  key={c.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background",
                  )}
                >
                  <input
                    type="radio"
                    name="course"
                    value={c.slug}
                    checked={selected}
                    onChange={() => setCourseSlug(c.slug)}
                    className="sr-only"
                  />
                  <CourseIcon slug={c.slug} src={c.icon} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {c.title.split(" — ")[0]}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {c.duration}
                    </p>
                  </div>
                  {selected && (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CreditCard className="size-4" strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              Plata cu cardul
              {cardTestMode && (
                <span className="ml-2 rounded-full bg-warning/15 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-warning">
                  Test
                </span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Accesul se activează automat, în câteva secunde.
            </p>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {marks.map(({ label, Icon }) => (
            <li key={label}>
              <Icon
                role="img"
                aria-label={label}
                aria-hidden={undefined}
                className="h-7 w-auto text-foreground/85"
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isPending}
          className={cn(
            buttonVariants(),
            "mt-4 h-12 w-full gap-2 text-sm font-semibold",
            isPending && "cursor-wait",
          )}
        >
          <CreditCard className="size-4" />
          {isPending
            ? "Se deschide checkout-ul…"
            : `Abonează-te — ${amountMDL} MDL / ${priceUnit}`}
        </button>

        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <Term icon={<RefreshCw className="size-3.5" />}>
            <span className="font-semibold">Abonament recurent.</span> Se
            reînnoiește automat la fiecare {priceUnit} până când îl anulezi.
            Poți anula oricând din pagina <span className="font-medium">Abonament</span> —
            accesul rămâne activ până la finalul perioadei deja plătite.
          </Term>
          <Term icon={<Lock className="size-3.5" />}>
            Plata e procesată de <span className="font-medium">Creem</span>, care
            figurează ca vânzător înregistrat și emite documentul fiscal.
            Tranzacția are loc în euro — suma exactă în lei depinde de cursul
            băncii tale. InfoBac nu vede și nu stochează datele cardului.
          </Term>
        </div>
      </div>
    </div>
  );
}

function Term({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
      <span className="mt-0.5 shrink-0 text-muted-foreground/70">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

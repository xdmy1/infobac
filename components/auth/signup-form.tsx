"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, MailCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupInput } from "@/lib/validations";
import { signupAction } from "@/lib/actions/auth";
import { pricingPlans, type PlanId } from "@/lib/content";
import { GoogleButton, AuthDivider } from "./google-button";

interface SignupFormProps {
  preselectedPlan?: PlanId;
  fromPath?: string;
}

export function SignupForm({ preselectedPlan, fromPath }: SignupFormProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmationSent, setConfirmationSent] = useState<{
    email: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
      // Default to adult; minors flip the radio explicitly so we don't
      // accidentally classify everyone as needing parental consent.
      isMinor: false,
      parentalConsent: false,
      parentEmail: "",
    },
  });

  const isMinor = watch("isMinor");

  useEffect(() => {
    if (fromPath === "cursuri") {
      // Subtle attribution; useful for analytics later but no UI noise.
    }
  }, [fromPath]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await signupAction(values);

      if (result.ok) {
        if (result.needsConfirmation) {
          setConfirmationSent({ email: result.email });
          toast.success("Cont creat. Verifică-ți emailul.");
        } else {
          toast.success("Cont creat. Te conducem la dashboard...");
          window.location.href = "/dashboard";
        }
        return;
      }

      toast.error(result.error);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof SignupInput, { message });
          }
        }
      }
    });
  });

  if (confirmationSent) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            Verifică-ți emailul
          </h2>
          <p className="text-pretty text-sm text-muted-foreground">
            Am trimis un link de confirmare la{" "}
            <span className="font-medium text-foreground">
              {confirmationSent.email}
            </span>
            . Click pe link ca să-ți activezi contul.
          </p>
          <p className="text-xs text-muted-foreground">
            Nu vezi emailul? Verifică folderul Spam sau{" "}
            <button
              type="button"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              onClick={() => setConfirmationSent(null)}
            >
              încearcă din nou
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  const planInfo = preselectedPlan
    ? pricingPlans.find((p) => p.id === preselectedPlan)
    : null;

  return (
    <div className="space-y-5">
      {planInfo && (
        <div className="flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-foreground">
            <span className="font-semibold">Plan selectat: {planInfo.name}</span>{" "}
            <span className="text-muted-foreground">
              · {planInfo.priceMDL} MDL / {planInfo.priceUnit}
            </span>
            <br />
            <span className="text-muted-foreground">
              Plătești după ce-ți creezi contul. Anulezi oricând la planurile
              lunare.
            </span>
          </p>
        </div>
      )}

      <GoogleButton label="Înregistrează-te cu Google" />
      <AuthDivider />

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Numele tău</Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            disabled={isPending}
            aria-invalid={!!errors.fullName}
            placeholder="Andrei Popescu"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={!!errors.email}
            placeholder="andrei@exemplu.md"
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Parolă</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            disabled={isPending}
            aria-invalid={!!errors.password}
            placeholder="Minim 8 caractere"
            {...register("password")}
          />
          {errors.password && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <fieldset
          className="space-y-2 rounded-lg border border-border bg-muted/30 p-3"
          aria-invalid={!!errors.isMinor}
        >
          <legend className="px-1 text-xs font-medium text-foreground">
            Vârsta ta
          </legend>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs">
            <input
              type="radio"
              value="false"
              disabled={isPending}
              className="mt-0.5 size-4 cursor-pointer border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card"
              {...register("isMinor", {
                setValueAs: (v) => v === "true" || v === true,
              })}
            />
            <span className="text-muted-foreground">
              Am 18 ani sau mai mult
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs">
            <input
              type="radio"
              value="true"
              disabled={isPending}
              className="mt-0.5 size-4 cursor-pointer border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card"
              {...register("isMinor", {
                setValueAs: (v) => v === "true" || v === true,
              })}
            />
            <span className="text-muted-foreground">
              Sunt minor (sub 18 ani)
            </span>
          </label>
          {errors.isMinor && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.isMinor.message}
            </p>
          )}
        </fieldset>

        {isMinor && (
          <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Conform legii din Moldova (Codul civil art. 21), minorii au
              nevoie de acordul unui părinte/tutore pentru contracte cu plată.
            </p>

            <label className="flex cursor-pointer items-start gap-2.5 text-xs">
              <input
                type="checkbox"
                disabled={isPending}
                className="mt-0.5 size-4 cursor-pointer rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card"
                aria-invalid={!!errors.parentalConsent}
                {...register("parentalConsent")}
              />
              <span className="text-muted-foreground">
                Am citit termenii împreună cu un părinte/tutore care e de acord
                cu contul și plata.
              </span>
            </label>
            {errors.parentalConsent && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.parentalConsent.message}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="parentEmail" className="text-xs">
                Email părinte/tutore{" "}
                <span className="font-normal text-muted-foreground">
                  (opțional, pentru notificări)
                </span>
              </Label>
              <Input
                id="parentEmail"
                type="email"
                autoComplete="off"
                disabled={isPending}
                aria-invalid={!!errors.parentEmail}
                placeholder="parinte@exemplu.md"
                {...register("parentEmail")}
              />
              {errors.parentEmail && (
                <p
                  role="alert"
                  className="text-xs font-medium text-destructive"
                >
                  {errors.parentEmail.message}
                </p>
              )}
            </div>
          </div>
        )}

        <label className="flex cursor-pointer items-start gap-2.5 text-xs">
          <input
            type="checkbox"
            disabled={isPending}
            className="mt-0.5 size-4 cursor-pointer rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card"
            aria-invalid={!!errors.terms}
            {...register("terms")}
          />
          <span className="text-muted-foreground">
            Sunt de acord cu{" "}
            <Link
              href="/legal/termeni"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Termenii și condițiile
            </Link>{" "}
            și{" "}
            <Link
              href="/legal/confidentialitate"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Politica de confidențialitate
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.terms.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants(),
            "h-11 w-full gap-2 text-sm font-medium",
            isPending && "cursor-wait"
          )}
        >
          {isPending ? "Creăm contul..." : "Creează cont"}
          {!isPending && <ArrowRight className="size-4" />}
        </button>
      </form>
    </div>
  );
}

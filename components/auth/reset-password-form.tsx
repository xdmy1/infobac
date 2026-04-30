"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from "@/lib/validations";
import { resetPasswordRequestAction } from "@/lib/actions/auth";

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordRequestInput>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await resetPasswordRequestAction(values);

      if (result.ok) {
        setSentTo(result.email);
        return;
      }

      toast.error(result.error);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof ResetPasswordRequestInput, { message });
          }
        }
      }
    });
  });

  if (sentTo) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            Verifică-ți emailul
          </h2>
          <p className="text-pretty text-sm text-muted-foreground">
            Dacă există un cont asociat cu{" "}
            <span className="font-medium text-foreground">{sentTo}</span>, am
            trimis un link de resetare. Linkul e valid 1 oră.
          </p>
          <p className="text-xs text-muted-foreground">
            Nu vezi emailul? Verifică folderul Spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
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

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          buttonVariants(),
          "h-11 w-full gap-2 text-sm font-medium",
          isPending && "cursor-wait"
        )}
      >
        {isPending ? "Trimitem..." : "Trimite link de resetare"}
        {!isPending && <ArrowRight className="size-4" />}
      </button>

      <p className="text-pretty text-center text-xs text-muted-foreground">
        Din motive de securitate, nu confirmăm dacă emailul există în sistem.
      </p>
    </form>
  );
}

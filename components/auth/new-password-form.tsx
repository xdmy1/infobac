"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  resetPasswordSubmitSchema,
  type ResetPasswordSubmitInput,
} from "@/lib/validations";
import { resetPasswordSubmitAction } from "@/lib/actions/auth";

export function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordSubmitInput>({
    resolver: zodResolver(resetPasswordSubmitSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await resetPasswordSubmitAction(values);

      // resetPasswordSubmitAction redirects on success.
      // If we get a value back, it's an error.
      if (result && !result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            if (message) {
              setError(field as keyof ResetPasswordSubmitInput, { message });
            }
          }
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="password">Parolă nouă</Label>
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

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirmă parola</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          aria-invalid={!!errors.confirmPassword}
          placeholder="Repetă parola"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.confirmPassword.message}
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
        {isPending ? "Salvăm..." : "Salvează parola nouă"}
        {!isPending && <ArrowRight className="size-4" />}
      </button>
    </form>
  );
}

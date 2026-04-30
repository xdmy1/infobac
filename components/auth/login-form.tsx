"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { GoogleButton } from "./google-button";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { loginAction } from "@/lib/actions/auth";

interface LoginFormProps {
  redirectTo?: string;
  initialError?: string;
  supabaseMissing?: boolean;
}

export function LoginForm({
  redirectTo,
  initialError,
  supabaseMissing,
}: LoginFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (initialError) {
      toast.error(decodeURIComponent(initialError));
    }
  }, [initialError]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values, redirectTo);
      // loginAction redirects on success. If we get a value back,
      // it's an error.
      if (result && !result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            if (message) {
              setError(field as keyof LoginInput, { message });
            }
          }
        }
      }
    });
  });

  return (
    <div className="space-y-5">
      {supabaseMissing && (
        <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>
            Autentificarea nu e disponibilă încă — proiectul Supabase nu e
            configurat. Marketing-ul e accesibil; te rugăm să revii curând.
          </p>
        </div>
      )}

      <GoogleButton redirectTo={redirectTo} />

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          sau
        </span>
      </div>

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Parolă</Label>
            <Link
              href="/resetare-parola"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Ai uitat parola?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={isPending}
            aria-invalid={!!errors.password}
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.password.message}
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
          {isPending ? "Te logăm..." : "Login"}
          {!isPending && <ArrowRight className="size-4" />}
        </button>
      </form>
    </div>
  );
}

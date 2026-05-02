"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";
import { loginWithGoogleAction } from "@/lib/actions/auth";

interface GoogleButtonProps {
  redirectTo?: string;
  label?: string;
  className?: string;
}

export function GoogleButton({
  redirectTo,
  label = "Continuă cu Google",
  className,
}: GoogleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      // On success the action calls redirect() and never returns. If we get
      // a value back, OAuth couldn't even start (Supabase down, provider not
      // enabled, etc.) — surface the error.
      const result = await loginWithGoogleAction(redirectTo);
      if (!result.ok) toast.error(result.error);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-70",
        className
      )}
    >
      <GoogleIcon className="size-5" />
      {isPending ? "Se deschide Google…" : label}
    </button>
  );
}

export function AuthDivider({ label = "sau" }: { label?: string }) {
  return (
    <div className="relative flex items-center" role="separator">
      <div className="h-px flex-1 bg-border" />
      <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

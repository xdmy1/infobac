"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Reads ?password_reset=1 from URL once and shows a success toast,
 * then strips the query param so a refresh doesn't re-fire it.
 */
export function PasswordResetToast() {
  const router = useRouter();
  const params = useSearchParams();
  const flag = params.get("password_reset");

  useEffect(() => {
    if (flag === "1") {
      toast.success("Parola a fost schimbată cu succes.");
      router.replace("/dashboard");
    }
  }, [flag, router]);

  return null;
}

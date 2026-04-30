import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Resetare parolă",
  description:
    "Resetează-ți parola contului InfoBac. Îți trimitem un link de resetare pe email.",
  alternates: { canonical: "/resetare-parola" },
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Resetează parola."
      description="Introdu emailul tău și îți trimitem un link de resetare."
      footer={
        <>
          Ți-ai amintit?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Înapoi la login
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}

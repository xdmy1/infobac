import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { NewPasswordForm } from "@/components/auth/new-password-form";

export const metadata: Metadata = {
  title: "Setează o parolă nouă",
  description: "Setează o parolă nouă pentru contul tău InfoBac.",
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <AuthCard
      title="Setează o parolă nouă."
      description="Folosește minim 8 caractere. Ceva ce poți reține, dar nu poate ghici nimeni."
    >
      <NewPasswordForm />
    </AuthCard>
  );
}

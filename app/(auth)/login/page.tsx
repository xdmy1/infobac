import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Autentifică-te în contul tău InfoBac pentru a continua pregătirea pentru BAC informatică.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect?: string;
    auth_error?: string;
    supabase_missing?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Bine ai revenit."
      description="Continuă unde ai rămas — Python, SQL sau Networking."
      footer={
        <>
          Nu ai cont?{" "}
          <Link
            href="/inregistrare"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Înregistrează-te gratuit
          </Link>
        </>
      }
    >
      <LoginForm
        redirectTo={params.redirect}
        initialError={params.auth_error}
        supabaseMissing={params.supabase_missing === "1"}
      />
    </AuthCard>
  );
}

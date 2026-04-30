import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import type { PlanId } from "@/lib/content";

export const metadata: Metadata = {
  title: "Înregistrează-te",
  description:
    "Creează un cont InfoBac. Alegi planul după înregistrare — de la 250 MDL/lună sau 950 MDL pe 6 luni.",
  alternates: { canonical: "/inregistrare" },
};

const VALID_PLANS: ReadonlySet<PlanId> = new Set([
  "module",
  "all",
  "semester",
]);

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; from?: string }>;
}) {
  const params = await searchParams;
  const preselectedPlan = VALID_PLANS.has(params.plan as PlanId)
    ? (params.plan as PlanId)
    : undefined;

  return (
    <AuthCard
      title="Creează cont."
      description="60 de secunde. Alegi planul după înregistrare, plătești când ești gata."
      footer={
        <>
          Ai deja cont?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </>
      }
    >
      <SignupForm preselectedPlan={preselectedPlan} fromPath={params.from} />
    </AuthCard>
  );
}

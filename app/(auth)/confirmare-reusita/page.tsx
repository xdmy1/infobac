import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Email confirmat",
  description: "Contul tău InfoBac e activ. Bun venit!",
  robots: { index: false, follow: false },
};

export default function ConfirmareReusitaPage() {
  return (
    <AuthCard
      title="Email confirmat."
      description="Contul tău e activ. Te-am logat automat — poți începe pregătirea."
      footer={
        <>
          Ai întrebări?{" "}
          <a
            href="mailto:hello@infobac.md"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            hello@infobac.md
          </a>
        </>
      }
    >
      <div className="space-y-6 text-center">
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </div>

        <div className="space-y-1.5 text-sm">
          <p className="font-semibold text-foreground">
            Totul e în regulă.
          </p>
          <p className="text-muted-foreground">
            Sesiunea e deschisă pe acest dispozitiv. Mergi la dashboard ca să
            vezi cursurile și să pornești prima lecție.
          </p>
        </div>

        <Link
          href="/dashboard"
          className={cn(
            buttonVariants(),
            "h-11 w-full gap-2 text-sm font-semibold",
          )}
        >
          Mergi la dashboard
          <ArrowRight className="size-4" />
        </Link>

        <Link
          href="/preturi"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-full gap-2 text-xs",
          )}
        >
          Sau alege un plan întâi
        </Link>
      </div>
    </AuthCard>
  );
}

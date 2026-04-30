import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Confirmă-ți emailul",
  description:
    "Verifică inbox-ul pentru linkul de confirmare InfoBac. Click pe el ca să-ți activezi contul.",
  robots: { index: false, follow: false },
};

export default function ConfirmEmailPage() {
  return (
    <AuthCard
      title="Verifică-ți emailul."
      description="Ți-am trimis un link de confirmare. Click pe el și te logăm automat."
      footer={
        <>
          Nu ai primit emailul?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Încearcă din nou
          </Link>
        </>
      }
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-7" />
        </div>

        <div className="space-y-1.5 text-sm">
          <p className="text-foreground">
            <span className="font-medium">Ai 24 de ore</span> să confirmi
            emailul.
          </p>
          <p className="text-muted-foreground">
            Verifică și folderul Spam — uneori ajunge acolo.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4 text-left">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Pași următori
          </p>
          <ol className="space-y-1 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-mono font-semibold text-foreground">1.</span>
              Deschide emailul de la InfoBac în inbox.
            </li>
            <li className="flex gap-2">
              <span className="font-mono font-semibold text-foreground">2.</span>
              Click pe „Confirmă emailul".
            </li>
            <li className="flex gap-2">
              <span className="font-mono font-semibold text-foreground">3.</span>
              Te aducem direct la dashboard.
            </li>
          </ol>
        </div>

        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full gap-2 text-sm"
          )}
        >
          Am confirmat — du-mă la dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </AuthCard>
  );
}

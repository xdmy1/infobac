import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Plată confirmată · InfoBac",
  robots: { index: false, follow: false },
};

/**
 * Where Creem sends the browser after a successful payment.
 *
 * Deliberately does not claim access is already granted: the webhook is what
 * grants it, and it can land a beat after this redirect — so promising
 * "you're in" here would sometimes be a lie.
 */
export default function ConfirmedPage() {
  return (
    <div className="mx-auto max-w-2xl px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20 lg:px-8">
      <div className="text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Plata a fost primită
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          Confirmăm plata cu procesatorul și activăm accesul — durează câteva
          secunde. Îți trimitem și un email cu confirmarea.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Card
          icon={<CreditCard className="size-5" />}
          title="Se activează automat"
          body="Nu trebuie să trimiți nimic. Reîncarcă dashboard-ul peste câteva secunde."
        />
        <Card
          icon={<MessageCircle className="size-5" />}
          title="Nu s-a activat?"
          body={`Dacă după 5 minute accesul lipsește, scrie-ne la ${siteConfig.contact.email} — răspundem în maxim o zi lucrătoare.`}
        />
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants(),
            "h-11 gap-2 px-5 text-sm font-semibold",
          )}
        >
          Înapoi la dashboard
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/abonament"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Vezi abonamentul
        </Link>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

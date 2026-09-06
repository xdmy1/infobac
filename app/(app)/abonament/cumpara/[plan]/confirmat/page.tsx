import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cerere trimisă · InfoBac",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ checkout_id?: string }>;
}

/**
 * Two ways to land here:
 *   - the MIA form submitted → the request is queued for manual review
 *   - Creem redirected after a card payment → `checkout_id` is present
 *
 * The card branch deliberately does not claim access is already granted. The
 * webhook is what grants it, and it can land a beat after this redirect, so
 * promising "you're in" here would sometimes be a lie.
 */
export default async function ConfirmedPage({ searchParams }: PageProps) {
  const { checkout_id } = await searchParams;
  const paidByCard = Boolean(checkout_id);

  return (
    <div className="mx-auto max-w-2xl px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20 lg:px-8">
      <div className="text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          {paidByCard ? "Plata a fost primită" : "Cererea ta e în review"}
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {paidByCard
            ? "Confirmăm plata cu procesatorul și activăm accesul — durează câteva secunde. Îți trimitem și un email."
            : "Verificăm plata și activăm accesul. De obicei sub o oră în zile lucrătoare. Te anunțăm pe email când totul e gata."}
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {paidByCard ? (
          <>
            <Card
              icon={<CreditCard className="size-5" />}
              title="Automat"
              body="Nu trebuie să trimiți nimic. Reîncarcă dashboard-ul peste câteva secunde."
            />
            <Card
              icon={<MessageCircle className="size-5" />}
              title="Nu s-a activat?"
              body="Dacă după 5 minute accesul lipsește, scrie-ne pe Telegram: +373 68 327 082."
            />
          </>
        ) : (
          <>
            <Card
              icon={<Clock className="size-5" />}
              title="Sub 1 oră"
              body="În program normal, cererile sunt aprobate în câteva minute."
            />
            <Card
              icon={<MessageCircle className="size-5" />}
              title="Telegram: +373 68 327 082"
              body="Dacă ai uitat să trimiți screenshot-ul, scrie-ne pe Telegram cu numele de pe cont."
            />
          </>
        )}
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
          {paidByCard ? "Vezi statusul plății" : "Vezi statusul cererii"}
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

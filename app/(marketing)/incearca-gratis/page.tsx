import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { TrialClaim } from "@/components/marketing/trial-claim";
import { buttonVariants } from "@/components/ui/button";
import { freeTrial, isTrialOfferOpen } from "@/lib/content";
import { getTrialStatus, type TrialStatus } from "@/lib/queries/trial";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "7 zile gratis, fără card",
  description:
    "Alegi un modul, apeși un buton și ai 7 zile de acces complet la InfoBac. Fără card, fără reînnoire automată. Ofertă până pe 15 septembrie.",
  alternates: { canonical: "/incearca-gratis" },
};

export default async function TrialPage() {
  const offerOpen = isTrialOfferOpen();

  let isLoggedIn = false;
  let status: TrialStatus | null = null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = !!user;
    if (isLoggedIn) {
      status = await getTrialStatus(supabase).catch(() => null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <header>
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="size-3.5" />
          Fără card
        </p>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {freeTrial.headline}
        </h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {freeTrial.subhead}
        </p>
      </header>

      <ul className="mt-8 grid gap-3">
        {freeTrial.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="text-sm text-muted-foreground">{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        {!offerOpen ? (
          <Notice
            icon={<CalendarClock className="size-4" />}
            title="Oferta s-a încheiat"
            body="Săptămâna gratuită a fost valabilă până pe 15 septembrie. Planurile rămân deschise oricând."
            cta={{ href: "/preturi", label: "Vezi prețurile" }}
          />
        ) : !isSupabaseConfigured || !isLoggedIn ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold">
              Ai nevoie de un cont ca să pornim cele {freeTrial.days} zile
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Durează un minut și nu se cere card nici la înregistrare, nici
              după.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/inregistrare?from=/incearca-gratis"
                className={cn(buttonVariants(), "gap-2")}
              >
                Creează cont
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login?redirect=/incearca-gratis"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Am deja cont
              </Link>
            </div>
          </div>
        ) : !status ? (
          // The read failed, so we do not know whether this student is
          // eligible. Offering the button anyway would hand them a click that
          // can only end in an error.
          <Notice
            icon={<CalendarClock className="size-4" />}
            title="Revenim într-un minut"
            body="Nu am putut verifica dacă oferta e disponibilă pentru contul tău. Reîncarcă pagina peste puțin timp."
            cta={{ href: "/preturi", label: "Vezi prețurile" }}
          />
        ) : status.isRunning ? (
          <Notice
            icon={<CalendarClock className="size-4" />}
            title={`Perioada ta de probă e activă — ${status.daysLeft} ${
              status.daysLeft === 1 ? "zi rămasă" : "zile rămase"
            }`}
            body="Continuă de unde ai rămas. Când se termină, accesul se oprește singur și decizi tu ce urmează."
            cta={
              status.courseSlug
                ? { href: `/curs/${status.courseSlug}`, label: "Continuă modulul" }
                : { href: "/dashboard", label: "Deschide platforma" }
            }
          />
        ) : status.startedAt ? (
          <Notice
            icon={<BadgeCheck className="size-4" />}
            title="Ai folosit deja săptămâna gratuită"
            body="Un cont, o singură perioadă de probă. Dacă ți-a plăcut, alege un plan și continui de unde ai rămas."
            cta={{ href: "/preturi", label: "Vezi prețurile" }}
          />
        ) : status.eligible ? (
          <TrialClaim />
        ) : (
          <Notice
            icon={<BadgeCheck className="size-4" />}
            title="Ai deja acces la platformă"
            body="Nu ai ce testa — cursurile tale sunt deschise. Le găsești în dashboard."
            cta={{ href: "/dashboard", label: "Deschide platforma" }}
          />
        )}
      </div>

      <p className="mt-8 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <CreditCard className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
        <span>
          Nu îți cerem datele cardului în niciun moment al acestei oferte și nu
          există nicio reînnoire automată de oprit. Plata apare abia dacă alegi
          singur un plan, după ce se termină cele {freeTrial.days} zile.
        </span>
      </p>
    </div>
  );
}

function Notice({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          <Link
            href={cta.href}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4"
          >
            {cta.label}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

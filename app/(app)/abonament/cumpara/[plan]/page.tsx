import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import { CheckoutForm } from "@/components/app/checkout-form";
import { pricingPlans, type PlanId } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { isCardCheckoutEnabled } from "@/lib/payments";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getPurchaseBlock } from "@/lib/queries/purchase";
import { CheckCircle2 } from "lucide-react";
import type { CourseSlug } from "@/lib/content/courses";

interface PageProps {
  params: Promise<{ plan: string }>;
  searchParams: Promise<{ course?: string }>;
}

const VALID_PLANS: ReadonlySet<PlanId> = new Set(["module", "all", "semester"]);
const VALID_COURSES: ReadonlySet<CourseSlug> = new Set([
  "python",
  "sql",
  "devices",
]);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { plan } = await params;
  return {
    title: `Cumpără ${plan} · InfoBac`,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps) {
  const { plan } = await params;
  const { course } = await searchParams;
  if (!VALID_PLANS.has(plan as PlanId)) notFound();

  const planData = pricingPlans.find((p) => p.id === plan);
  if (!planData) notFound();

  const initialCourse = VALID_COURSES.has(course as CourseSlug)
    ? (course as CourseSlug)
    : undefined;

  // Server-side duplicate guard, so the form isn't even shown for a plan the
  // user already owns. The action re-checks — this is just the friendly path.
  let block = null;
  if (isCardCheckoutEnabled && isSupabaseConfigured) {
    const supabase = await createClient();
    block = await getPurchaseBlock(supabase, plan as PlanId, initialCourse ?? null);
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-14 lg:px-8">
      <Link
        href="/preturi"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Prețuri
      </Link>

      <header className="mt-6 mb-8 md:mb-10">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Cumpără · {planData.name}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {planData.priceMDL} MDL
          <span className="ml-2 text-base font-normal text-muted-foreground">
            / {planData.priceUnit}
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {planData.description}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Note
            icon={<Clock className="size-4" />}
            title={`Reînnoire la ${planData.priceUnit}`}
            description={`Abonament recurent. Anulezi oricând din pagina Abonament, iar accesul rămâne până la finalul perioadei plătite.`}
          />
          <Note
            icon={<ShieldCheck className="size-4" />}
            title="Activare instantă"
            description="Plătești cu cardul și accesul se deschide automat, fără aprobare manuală."
          />
        </div>
      </header>

      {block ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CheckCircle2 className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Ai deja acces</p>
              <p className="mt-1 text-sm text-muted-foreground">{block.reason}</p>
              <Link
                href="/abonament"
                className="mt-3 inline-flex text-sm font-medium text-primary underline underline-offset-4"
              >
                Vezi abonamentul →
              </Link>
            </div>
          </div>
        </div>
      ) : isCardCheckoutEnabled ? (
        <CheckoutForm
          plan={plan as PlanId}
          amountMDL={planData.priceMDL}
          initialCourseSlug={initialCourse}
          requiresCourseSelection={!!planData.requiresCourseSelection}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Plățile sunt temporar indisponibile. Scrie-ne la{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>{" "}
          și te anunțăm imediat ce revin.
        </div>
      )}
    </div>
  );
}

function Note({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inbox, Archive } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getPendingPaymentRequests,
  getReviewedPaymentRequests,
} from "@/lib/queries/payment";
import { isPreviewMode } from "@/lib/preview-mode";
import { AdminPaymentRow } from "@/components/app/admin-payment-row";

export const metadata: Metadata = {
  title: "Plăți · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPlatiPage() {
  if (isPreviewMode) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  // Cheap admin check via the server-side helper.
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) notFound();

  const [pending, reviewed] = await Promise.all([
    getPendingPaymentRequests(supabase),
    getReviewedPaymentRequests(supabase, 25),
  ]);

  return (
    <div className="space-y-8 pb-10">
      <header>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Cereri de abonament
          </h1>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {pending.length} pending
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Aprobă cererea după ce verifici plata MIA. La aprobare, sistemul
          atribuie cursurile + perioada automat.
        </p>
      </header>

      <section>
        <SectionHeader
          icon={<Inbox className="size-4" />}
          title="În așteptare"
          count={pending.length}
        />
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            Nicio cerere în așteptare. 🎉
          </p>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <AdminPaymentRow key={r.id} row={r} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHeader
          icon={<Archive className="size-4" />}
          title="Istoric"
          count={reviewed.length}
        />
        {reviewed.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Niciun istoric încă.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviewed.map((r) => (
              <AdminPaymentRow key={r.id} row={r} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="inline-flex size-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </span>
      <h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
      <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-bold tabular-nums">
        {count}
      </span>
    </div>
  );
}

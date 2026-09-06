import type { Metadata } from "next";
import { ProfileForm } from "@/components/app/profile-form";
import { DeleteAccount } from "@/components/app/delete-account";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries/user";
import {
  isPreviewMode,
  previewProfile,
  previewUser,
} from "@/lib/preview-mode";
import { Reveal, RevealItem } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Setări",
  robots: { index: false, follow: false },
};

export default async function SetariPage() {
  let defaults: {
    full_name: string;
    email: string;
    school: string;
    grade: number | "";
  };

  if (isPreviewMode) {
    defaults = {
      full_name: previewProfile.full_name,
      email: previewUser.email,
      school: previewProfile.school ?? "",
      grade: previewProfile.grade ?? "",
    };
  } else {
    const supabase = await createClient();
    const [user, profile] = await Promise.all([
      getCurrentUser(supabase),
      getCurrentProfile(supabase),
    ]);
    defaults = {
      full_name: profile?.full_name ?? "",
      email: user?.email ?? "",
      school: profile?.school ?? "",
      grade: profile?.grade ?? "",
    };
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <Reveal staggerChildren={0.1}>
        <RevealItem variant="fade-up">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Setări
          </p>
        </RevealItem>
        <RevealItem variant="fade-blur">
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Profilul tău.
          </h1>
        </RevealItem>
        <RevealItem variant="fade-up">
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Datele care apar pe certificări, în comunicări și în comunitatea
            internă.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal variant="fade-up" delay={0.2}>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-foreground/5 md:p-8">
          <ProfileForm defaults={defaults} />
        </section>
      </Reveal>

      <section className="rounded-2xl border border-destructive/30 bg-card p-6">
        <h2 className="text-base font-bold tracking-tight">Zona periculoasă</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Ștergerea contului elimină definitiv profilul, progresul și accesul
          la cursuri. Dacă ai un abonament activ, îl anulăm automat înainte de
          ștergere, ca să nu-ți mai fie taxat cardul.
        </p>
        <DeleteAccount />
      </section>
    </div>
  );
}

"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { startTrialSchema, type StartTrialInput } from "@/lib/validations";

export type StartTrialResult =
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
  /** Where to send the student next, and when their week runs out. */
  | { ok: true; redirectTo: string; endsAt: string };

/**
 * Turns the exceptions raised by `start_free_trial` into sentences.
 *
 * Each refusal is its own named exception in the database precisely so the
 * student is told which door is closed, instead of one shrug that covers
 * "you already used it", "the offer ended" and "you already paid".
 */
function messageForRefusal(raw: string): string {
  if (raw.includes("trial_already_used")) {
    return "Ai folosit deja săptămâna gratuită. Un cont, o singură perioadă de probă.";
  }
  if (raw.includes("trial_offer_closed")) {
    return "Oferta s-a încheiat pe 15 septembrie. Vezi planurile la Prețuri.";
  }
  if (raw.includes("already_has_access")) {
    return "Ai deja acces activ la platformă, nu ai ce testa.";
  }
  if (raw.includes("unknown_course")) {
    return "Modulul ales nu există.";
  }
  if (raw.includes("not_authenticated")) {
    return "Sesiunea a expirat. Re-loghează-te.";
  }
  return "Nu am putut porni perioada de probă. Reîncearcă.";
}

/**
 * Starts the seven free days on one module.
 *
 * No card is involved at any step: there is no provider call, no checkout and
 * nothing stored to charge later. The grant is a `course_access` row with an
 * expiry, so when the week is up access stops on its own and the student is
 * never billed for a renewal they did not ask for.
 *
 * Every condition — one per account, offer still open, no live access already
 * — is enforced inside `start_free_trial`. The checks the UI does are there to
 * choose what to show, never to decide who gets in.
 */
export async function startTrialAction(
  input: StartTrialInput,
): Promise<StartTrialResult> {
  const parsed = startTrialSchema.safeParse(input);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      error: flat.formErrors[0] ?? "Alege un modul.",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }
  const { courseSlug } = parsed.data;

  if (!isSupabaseConfigured) {
    return { ok: false, error: "Platforma nu e configurată." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  const { data, error } = await supabase.rpc("start_free_trial", {
    p_course_slug: courseSlug,
  });

  if (error) {
    console.warn("[trial] start failed:", error.message);
    return { ok: false, error: messageForRefusal(error.message) };
  }

  const granted = data?.[0];
  if (!granted) {
    return { ok: false, error: "Nu am putut porni perioada de probă. Reîncearcă." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/abonament");
  revalidatePath("/incearca-gratis");
  revalidatePath(`/curs/${courseSlug}`);

  return {
    ok: true,
    redirectTo: `/curs/${courseSlug}`,
    endsAt: granted.ends_at,
  };
}

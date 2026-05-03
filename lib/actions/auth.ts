"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  loginSchema,
  signupSchema,
  resetPasswordRequestSchema,
  resetPasswordSubmitSchema,
  type LoginInput,
  type SignupInput,
  type ResetPasswordRequestInput,
  type ResetPasswordSubmitInput,
} from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

// -----------------------------------------------------------------------------
// Result types
// -----------------------------------------------------------------------------

export type SignupResult =
  | {
      ok: true;
      /** True when Supabase enforces email confirmation (no session yet). */
      needsConfirmation: boolean;
      email: string;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof SignupInput, string>>;
    };

export type LoginResult =
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof LoginInput, string>>;
    };
// loginAction returns SignInResult | never (redirects on success)

export type ResetRequestResult =
  | { ok: true; email: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof ResetPasswordRequestInput, string>>;
    };

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function configError(): string {
  return (
    "Autentificarea nu e disponibilă încă — proiectul Supabase nu e " +
    "configurat. Echipa noastră lucrează la asta."
  );
}

function humanize(supabaseMessage: string | undefined): string {
  if (!supabaseMessage) return "S-a întâmplat ceva neașteptat. Reîncearcă.";
  const m = supabaseMessage.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "Email sau parolă greșite.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirmă-ți emailul mai întâi. Verifică inbox-ul (și spam-ul).";
  }
  if (m.includes("user already registered")) {
    return "Există deja un cont cu acest email. Încearcă să te loghezi.";
  }
  if (m.includes("weak password") || m.includes("at least 8")) {
    return "Parola e prea slabă — minim 8 caractere.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Prea multe încercări. Așteaptă câteva minute și reîncearcă.";
  }
  if (m.includes("oauth") || m.includes("provider not enabled")) {
    return (
      "Autentificarea cu Google nu e activată încă. Folosește email + " +
      "parolă pentru moment."
    );
  }
  return supabaseMessage;
}

async function getSiteOrigin(): Promise<string> {
  // The request host is the canonical origin for THIS request — trust it
  // over any env config. Without this, a stale NEXT_PUBLIC_SITE_URL on
  // Vercel (e.g. left as http://localhost:3000) would send OAuth users to
  // localhost after login.
  const h = await headers();
  const host = h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ??
      (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return siteConfig.url;
}

/**
 * Origin used for links that LEAVE the server and arrive in user inboxes
 * (email confirmation, password reset). Pinned to the deployed app so a
 * signup triggered from `localhost` still produces a clickable production
 * link. Override via EMAIL_LINK_BASE_URL when the canonical domain changes
 * — the vercel.app URL keeps working alongside any custom domain.
 */
function getEmailLinkOrigin(): string {
  const env = process.env.EMAIL_LINK_BASE_URL?.replace(/\/$/, "");
  if (env) return env;
  return "https://infobac.vercel.app";
}

// -----------------------------------------------------------------------------
// signupAction
// -----------------------------------------------------------------------------

export async function signupAction(input: unknown): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof SignupInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof SignupInput | undefined;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return {
      ok: false,
      error: "Verifică datele formularului.",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: configError() };
  }

  const supabase = await createClient();
  const emailOrigin = getEmailLinkOrigin();

  const parentEmail =
    parsed.data.parentEmail && parsed.data.parentEmail.length > 0
      ? parsed.data.parentEmail
      : null;
  const consentTimestamp = parsed.data.isMinor ? new Date().toISOString() : null;

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${emailOrigin}/auth/callback?next=/confirmare-reusita`,
      data: {
        full_name: parsed.data.fullName,
        // Stored in raw_user_meta_data so the handle_new_user trigger (and
        // any future audit) can see the original consent payload even if the
        // profiles row is later overwritten.
        is_minor: parsed.data.isMinor,
        parental_consent_at: consentTimestamp,
        parent_email: parentEmail,
      },
    },
  });

  if (error) {
    return { ok: false, error: humanize(error.message) };
  }

  // Mirror consent fields onto the profiles row. The handle_new_user trigger
  // creates the row from auth.users; we then write the consent fields (which
  // the trigger doesn't know about) so they're queryable via the public
  // schema and respect the column-level grants from migration 0009.
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_minor: parsed.data.isMinor,
        parental_consent_at: consentTimestamp,
        parent_email: parentEmail,
      })
      .eq("id", data.user.id);

    if (profileError) {
      // Non-fatal: the auth account exists and consent is preserved in
      // user_metadata. Log so we can backfill if this ever fires.
      console.warn(
        "[auth] Failed to mirror consent fields onto profiles:",
        profileError.message,
      );
    }
  }

  return {
    ok: true,
    needsConfirmation: !data.session,
    email: parsed.data.email,
  };
}

// -----------------------------------------------------------------------------
// loginAction (redirects on success)
// -----------------------------------------------------------------------------

export async function loginAction(
  input: unknown,
  redirectTo?: string
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof LoginInput | undefined;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return {
      ok: false,
      error: "Verifică datele formularului.",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: configError() };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, error: humanize(error.message) };
  }

  const target =
    redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";
  redirect(target);
}

// -----------------------------------------------------------------------------
// loginWithGoogleAction (redirects on success to provider)
// -----------------------------------------------------------------------------

export async function loginWithGoogleAction(redirectTo?: string) {
  if (!isSupabaseConfigured) {
    return { ok: false as const, error: configError() };
  }

  const supabase = await createClient();
  const origin = await getSiteOrigin();
  const next = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data?.url) {
    return { ok: false as const, error: humanize(error?.message) };
  }

  redirect(data.url);
}

// -----------------------------------------------------------------------------
// logoutAction
// -----------------------------------------------------------------------------

export async function logoutAction() {
  if (!isSupabaseConfigured) {
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// -----------------------------------------------------------------------------
// resetPasswordRequestAction (sends email with link)
// -----------------------------------------------------------------------------

export async function resetPasswordRequestAction(
  input: unknown
): Promise<ResetRequestResult> {
  const parsed = resetPasswordRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<
      Record<keyof ResetPasswordRequestInput, string>
    > = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as
        | keyof ResetPasswordRequestInput
        | undefined;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return {
      ok: false,
      error: "Verifică adresa de email.",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: configError() };
  }

  const supabase = await createClient();
  const emailOrigin = getEmailLinkOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${emailOrigin}/auth/callback?next=/resetare-parola/noua`,
    }
  );

  if (error) {
    // Don't leak whether the email exists — return success either way.
    console.warn("[auth] resetPasswordForEmail error:", error.message);
  }

  return { ok: true, email: parsed.data.email };
}

// -----------------------------------------------------------------------------
// resetPasswordSubmitAction (sets new password for authenticated user)
// -----------------------------------------------------------------------------

export type ResetSubmitResult =
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ResetPasswordSubmitInput, string>> };

export async function resetPasswordSubmitAction(
  input: unknown
): Promise<ResetSubmitResult> {
  const parsed = resetPasswordSubmitSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<
      Record<keyof ResetPasswordSubmitInput, string>
    > = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof ResetPasswordSubmitInput | undefined;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return {
      ok: false,
      error: "Verifică datele formularului.",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: configError() };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error:
        "Sesiunea de resetare a expirat. Cere un link nou de pe pagina de resetare.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, error: humanize(error.message) };
  }

  redirect("/dashboard?password_reset=1");
}

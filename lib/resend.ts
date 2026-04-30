import "server-only";
import { Resend } from "resend";
import type { ReactElement } from "react";
import { siteConfig } from "./site";

const apiKey = process.env.RESEND_API_KEY;

export const isResendConfigured = Boolean(apiKey);

const client = apiKey ? new Resend(apiKey) : null;

function getFromAddress(): string {
  const fromName = process.env.RESEND_FROM_NAME ?? siteConfig.name;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email;
  return `${fromName} <${fromEmail}>`;
}

export type SendEmailResult =
  | { ok: true; mode: "sent"; id?: string }
  | { ok: true; mode: "dev" }
  | { ok: false; error: string };

interface SendEmailInput {
  to: string;
  subject: string;
  react: ReactElement;
  /** Optional plain-text fallback (email clients without HTML). */
  text?: string;
  /** Reply-to override (default: from address). */
  replyTo?: string;
  /** Tags for Resend dashboard filtering. */
  tags?: { name: string; value: string }[];
}

/**
 * Send a transactional email via Resend. Falls back to console.info in dev
 * when RESEND_API_KEY isn't set, so signups/contact still work locally.
 */
export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  if (!client) {
    console.info(
      `[email] Resend not configured — would send to ${input.to}: "${input.subject}"`
    );
    return { ok: true, mode: "dev" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: getFromAddress(),
      to: input.to,
      subject: input.subject,
      react: input.react,
      text: input.text,
      replyTo: input.replyTo,
      tags: input.tags,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, mode: "sent", id: data?.id };
  } catch (err) {
    console.error("[email] Network error sending via Resend:", err);
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "Eroare necunoscută la trimitere.",
    };
  }
}

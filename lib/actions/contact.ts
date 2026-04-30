"use server";

import { contactSchema, type ContactInput, contactTopics } from "@/lib/validations";
import { siteConfig } from "@/lib/site";

export type ContactActionResult =
  | { ok: true; mode: "sent" | "dev" }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof ContactInput, string>>;
    };

export async function submitContact(
  input: unknown
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Verifică datele formularului.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.hp && data.hp.length > 0) {
    return { ok: true, mode: "dev" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email;

  if (!apiKey) {
    console.info(
      "[contact] RESEND_API_KEY not set — running in dev mode. Submission:",
      {
        from: `${data.name} <${data.email}>`,
        topic:
          contactTopics.find((t) => t.value === data.topic)?.label ?? data.topic,
        message: data.message,
        receivedAt: new Date().toISOString(),
      }
    );
    return { ok: true, mode: "dev" };
  }

  try {
    const topicLabel =
      contactTopics.find((t) => t.value === data.topic)?.label ?? data.topic;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${process.env.RESEND_FROM_NAME ?? siteConfig.name} <${toEmail}>`,
        to: [siteConfig.contact.email],
        reply_to: data.email,
        subject: `[Contact · ${topicLabel}] ${data.name}`,
        text: [
          `De la: ${data.name} <${data.email}>`,
          `Subiect: ${topicLabel}`,
          "",
          data.message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend send failed:", res.status, detail);
      return {
        ok: false,
        error:
          "Nu am reușit să trimitem mesajul acum. Încearcă din nou peste câteva minute.",
      };
    }

    return { ok: true, mode: "sent" };
  } catch (err) {
    console.error("[contact] Network error sending via Resend:", err);
    return {
      ok: false,
      error: "Nu am putut trimite mesajul. Verifică conexiunea și reîncearcă.",
    };
  }
}

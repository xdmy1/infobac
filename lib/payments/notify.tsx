import "server-only";
import { sendEmail } from "@/lib/resend";
import { pricingPlans, type PlanId } from "@/lib/content";
import PaymentSuccessEmail from "@/emails/payment-success";
import OwnerPaymentEmail from "@/emails/owner-payment";

interface PaymentSuccessNotification {
  to: string;
  fullName?: string | null;
  plan: PlanId;
  amountMDL: number;
  /** ISO timestamp from `subscriptions.current_period_end`, if known. */
  accessUntil?: string | null;
}

/**
 * Sends the "access is live" email after a card payment clears.
 *
 * Best-effort by design: the webhook must answer 200 once access is granted,
 * otherwise Creem retries and we re-grant on every retry. A failed email is
 * logged, never thrown.
 */
export async function sendPaymentSuccessEmail({
  to,
  fullName,
  plan,
  amountMDL,
  accessUntil,
}: PaymentSuccessNotification): Promise<void> {
  const planName = pricingPlans.find((p) => p.id === plan)?.name ?? plan;
  const formattedUntil = accessUntil
    ? new Intl.DateTimeFormat("ro-MD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(accessUntil))
    : undefined;

  try {
    await sendEmail({
      to,
      subject: "Accesul tău e activ — InfoBac",
      react: (
        <PaymentSuccessEmail
          name={firstName(to, fullName)}
          plan={planName}
          amountMDL={amountMDL}
          accessUntil={formattedUntil}
        />
      ),
      tags: [
        { name: "type", value: "payment-success" },
        { name: "plan", value: plan },
        { name: "provider", value: "creem" },
      ],
    });
  } catch (err) {
    console.warn("[creem] payment-success email failed:", err);
  }
}

function firstName(email: string, fullName?: string | null): string {
  if (fullName?.trim()) return fullName.trim().split(/\s+/)[0]!;
  return email.split("@")[0] ?? "elev";
}


const OWNER_EMAIL =
  process.env.OWNER_NOTIFY_EMAIL ?? "damian.bobernaga@gmail.com";

interface OwnerPaymentNotification {
  planName: string;
  amountMDL: number;
  amountCharged?: string;
  customerName?: string | null;
  customerEmail: string;
  courseName?: string | null;
  isRenewal?: boolean;
}

/**
 * Internal heads-up to the owner on every cleared card payment. Best-effort:
 * the webhook has already granted access, so a failed email is logged only.
 */
export async function sendOwnerPaymentEmail(
  n: OwnerPaymentNotification,
): Promise<void> {
  try {
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `${n.isRenewal ? "Reînnoire" : "Plată nouă"}: ${n.planName} — ${n.customerEmail}`,
      react: (
        <OwnerPaymentEmail
          planName={n.planName}
          amountMDL={n.amountMDL}
          amountCharged={n.amountCharged}
          customerName={n.customerName ?? undefined}
          customerEmail={n.customerEmail}
          courseName={n.courseName ?? undefined}
          isRenewal={n.isRenewal}
        />
      ),
      tags: [{ name: "type", value: "owner-payment" }],
    });
  } catch (err) {
    console.warn("[creem] owner notification failed:", err);
  }
}

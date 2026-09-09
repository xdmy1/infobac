import { Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { emailBrand } from "@/lib/email-brand";

interface OwnerPaymentEmailProps {
  planName: string;
  amountMDL: number;
  amountCharged?: string;
  customerName?: string;
  customerEmail: string;
  courseName?: string;
  isRenewal?: boolean;
}

const formatMDL = new Intl.NumberFormat("ro-MD", {
  maximumFractionDigits: 0,
}).format;

/** Internal heads-up to the owner whenever a card payment clears. */
export default function OwnerPaymentEmail({
  planName,
  amountMDL,
  amountCharged,
  customerName,
  customerEmail,
  courseName,
  isRenewal,
}: OwnerPaymentEmailProps) {
  return (
    <EmailLayout preview={`${isRenewal ? "Reînnoire" : "Plată nouă"}: ${planName} — ${formatMDL(amountMDL)} MDL`}>
      <Text style={emailStyles.heading}>
        {isRenewal ? "Reînnoire abonament" : "Plată nouă"} 💳
      </Text>

      <Text style={emailStyles.paragraph}>
        {customerName ? `${customerName} ` : ""}(
        {customerEmail}) {isRenewal ? "și-a reînnoit" : "a achitat"} planul{" "}
        <strong>{planName}</strong>
        {courseName ? ` (${courseName})` : ""}.
      </Text>

      <Section
        style={{
          ...emailStyles.card,
          padding: "16px 20px",
          backgroundColor: emailBrand.colors.background,
        }}
      >
        <Row label="Plan" value={planName} />
        {courseName ? <Row label="Curs" value={courseName} /> : null}
        <Row label="Preț listă" value={`${formatMDL(amountMDL)} MDL`} />
        {amountCharged ? <Row label="Taxat efectiv" value={amountCharged} /> : null}
        <Row label="Client" value={customerEmail} />
      </Section>

      <Text style={{ ...emailStyles.paragraph, fontSize: "13px", color: emailBrand.colors.mutedForeground }}>
        Accesul a fost activat automat. Nu trebuie să faci nimic.
      </Text>
    </EmailLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ margin: "2px 0", fontSize: "14px" }}>
      <span style={{ color: emailBrand.colors.mutedForeground }}>{label}: </span>
      <strong>{value}</strong>
    </Text>
  );
}

OwnerPaymentEmail.PreviewProps = {
  planName: "Toate modulele",
  amountMDL: 540,
  amountCharged: "€28.00",
  customerName: "Andrei Preview",
  customerEmail: "andrei@example.com",
  isRenewal: false,
} satisfies OwnerPaymentEmailProps;

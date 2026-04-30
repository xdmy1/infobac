import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { emailBrand } from "@/lib/email-brand";
import { siteConfig } from "@/lib/site";

interface PaymentSuccessEmailProps {
  name: string;
  plan: "Basic" | "Standard" | "Lifetime";
  amountMDL: number;
  invoiceUrl?: string;
  nextChargeDate?: string;
}

const formatMDL = new Intl.NumberFormat("ro-MD", {
  maximumFractionDigits: 0,
}).format;

export default function PaymentSuccessEmail({
  name,
  plan,
  amountMDL,
  invoiceUrl,
  nextChargeDate,
}: PaymentSuccessEmailProps) {
  return (
    <EmailLayout preview={`Plata pentru planul ${plan} confirmată.`}>
      <Text style={emailStyles.heading}>Mulțumim, {name}!</Text>

      <Text style={emailStyles.paragraph}>
        Plata pentru planul <strong>{plan}</strong> a fost confirmată. Ai
        acces complet la cele 3 cursuri și la toate simulările.
      </Text>

      <Section
        style={{
          ...emailStyles.card,
          padding: "20px 24px",
          backgroundColor: emailBrand.colors.background,
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ width: "100%" }}
        >
          <tbody>
            <tr>
              <td style={{ paddingBottom: "8px" }}>
                <Text
                  style={{
                    ...emailStyles.paragraphMuted,
                    margin: 0,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Plan
                </Text>
              </td>
              <td style={{ paddingBottom: "8px", textAlign: "right" }}>
                <Text
                  style={{
                    ...emailStyles.paragraph,
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {plan}
                </Text>
              </td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "8px" }}>
                <Text
                  style={{
                    ...emailStyles.paragraphMuted,
                    margin: 0,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Sumă
                </Text>
              </td>
              <td style={{ paddingBottom: "8px", textAlign: "right" }}>
                <Text
                  style={{
                    ...emailStyles.paragraph,
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {formatMDL(amountMDL)} MDL
                </Text>
              </td>
            </tr>
            {nextChargeDate && (
              <tr>
                <td>
                  <Text
                    style={{
                      ...emailStyles.paragraphMuted,
                      margin: 0,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Următoarea plată
                  </Text>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Text
                    style={{
                      ...emailStyles.paragraph,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {nextChargeDate}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section style={{ margin: "24px 0", textAlign: "center" }}>
        <Button
          href={`${siteConfig.url}/dashboard`}
          style={emailStyles.buttonPrimary}
        >
          Continuă pregătirea
        </Button>
      </Section>

      {invoiceUrl && (
        <Text style={emailStyles.paragraphMuted}>
          Ai nevoie de factură fiscală?{" "}
          <a href={invoiceUrl} style={emailStyles.link}>
            Descarcă PDF
          </a>
          .
        </Text>
      )}

      <Text style={emailStyles.paragraphMuted}>
        Politica de refund: 7 zile fără întrebări. Răspunde la acest email
        dacă ai schimbat părerea.
      </Text>
    </EmailLayout>
  );
}

PaymentSuccessEmail.PreviewProps = {
  name: "Andrei",
  plan: "Standard",
  amountMDL: 899,
  invoiceUrl: "https://infobac.md/factura/preview",
  nextChargeDate: "31 mai 2026",
} satisfies PaymentSuccessEmailProps;

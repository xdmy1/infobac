import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { emailBrand } from "@/lib/email-brand";
import { siteConfig } from "@/lib/site";

interface PaymentSuccessEmailProps {
  name: string;
  /** Display name of the plan (e.g. "Un modul", "Toate modulele", "Pe 6 luni"). */
  plan: string;
  amountMDL: number;
  invoiceUrl?: string;
  /** Display string for when access expires (e.g. "28 octombrie 2026"). */
  accessUntil?: string;
}

const formatMDL = new Intl.NumberFormat("ro-MD", {
  maximumFractionDigits: 0,
}).format;

export default function PaymentSuccessEmail({
  name,
  plan,
  amountMDL,
  invoiceUrl,
  accessUntil,
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
            {accessUntil && (
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
                    Acces până la
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
                    {accessUntil}
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

    </EmailLayout>
  );
}

PaymentSuccessEmail.PreviewProps = {
  name: "Andrei",
  plan: "Toate modulele",
  amountMDL: 550,
  invoiceUrl: "https://infobac.md/factura/preview",
  accessUntil: "28 octombrie 2026",
} satisfies PaymentSuccessEmailProps;

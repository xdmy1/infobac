import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { emailBrand } from "@/lib/email-brand";
import { siteConfig } from "@/lib/site";

interface PaymentPendingEmailProps {
  name: string;
  planName: string;
  amountMDL: number;
  selectedCourse?: string;
}

const formatMDL = new Intl.NumberFormat("ro-MD", {
  maximumFractionDigits: 0,
}).format;

export default function PaymentPendingEmail({
  name,
  planName,
  amountMDL,
  selectedCourse,
}: PaymentPendingEmailProps) {
  return (
    <EmailLayout
      preview={`Am primit cererea ta pentru ${planName}. Activăm accesul în curând.`}
    >
      <Text style={emailStyles.heading}>Hei, {name}!</Text>

      <Text style={emailStyles.paragraph}>
        Am primit cererea ta de plată pentru planul{" "}
        <strong>{planName}</strong>
        {selectedCourse ? ` (${selectedCourse})` : ""}. O verificăm și îți
        activăm accesul în maxim <strong>24 de ore lucrătoare</strong> — de
        obicei mult mai repede.
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
                  {planName}
                </Text>
              </td>
            </tr>
            {selectedCourse && (
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
                    Curs
                  </Text>
                </td>
                <td style={{ paddingBottom: "8px", textAlign: "right" }}>
                  <Text
                    style={{
                      ...emailStyles.paragraph,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {selectedCourse}
                  </Text>
                </td>
              </tr>
            )}
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
                  Sumă
                </Text>
              </td>
              <td style={{ textAlign: "right" }}>
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
          </tbody>
        </table>
      </Section>

      <Text style={emailStyles.paragraphMuted}>
        Între timp, poți citi gratis primele 2 lecții din Python ca să te
        familiarizezi cu platforma.
      </Text>

      <Section style={{ margin: "24px 0", textAlign: "center" }}>
        <Button
          href={`${siteConfig.url}/cursuri`}
          style={emailStyles.buttonPrimary}
        >
          Începe cu lecțiile gratuite
        </Button>
      </Section>

      <Text style={emailStyles.paragraphMuted}>
        Dacă ceva e greșit cu cererea (sumă, plan, curs), răspunde direct la
        acest email — îți răspundem rapid.
      </Text>
    </EmailLayout>
  );
}

PaymentPendingEmail.PreviewProps = {
  name: "Andrei",
  planName: "Toate modulele",
  amountMDL: 550,
  selectedCourse: undefined,
} satisfies PaymentPendingEmailProps;

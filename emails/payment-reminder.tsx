import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { emailBrand } from "@/lib/email-brand";
import { siteConfig } from "@/lib/site";

interface PaymentReminderEmailProps {
  name: string;
  /** Optional admin-typed note shown above the CTA. */
  message?: string;
}

export default function PaymentReminderEmail({
  name,
  message,
}: PaymentReminderEmailProps) {
  return (
    <EmailLayout
      preview="Accesul tău e suspendat — plătește pentru a continua."
    >
      <Text style={emailStyles.heading}>Hei, {name} —</Text>

      <Text style={emailStyles.paragraph}>
        Accesul tău la cursurile InfoBac e <strong>suspendat temporar</strong>{" "}
        pentru că nu avem o plată activă. Cursurile rămân pe loc și progresul
        tău e păstrat — alegi un plan și continui de unde ai rămas.
      </Text>

      {message ? (
        <Section
          style={{
            ...emailStyles.card,
            backgroundColor: emailBrand.colors.background,
            borderColor: emailBrand.colors.warning,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <Text
            style={{
              ...emailStyles.paragraph,
              margin: "0 0 8px 0",
              fontWeight: 600,
            }}
          >
            Mesaj de la echipa InfoBac
          </Text>
          <Text style={{ ...emailStyles.paragraphMuted, margin: "0" }}>
            {message}
          </Text>
        </Section>
      ) : null}

      <Section style={{ margin: "24px 0", textAlign: "center" }}>
        <Button
          href={`${siteConfig.url}/preturi`}
          style={emailStyles.buttonPrimary}
        >
          Vezi prețuri
        </Button>
      </Section>

      <Text style={emailStyles.paragraphMuted}>
        Ai o întrebare? Răspunde direct la acest email sau scrie-ne la{" "}
        <a href="mailto:hello@infobac.md" style={emailStyles.link}>
          hello@infobac.md
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

PaymentReminderEmail.PreviewProps = {
  name: "Andrei",
  message:
    "Am observat că abonamentul a expirat săptămâna trecută. Reia plata oricând și revii imediat.",
} satisfies PaymentReminderEmailProps;

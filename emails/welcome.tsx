import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { siteConfig } from "@/lib/site";

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout
      preview={`Bun venit pe ${siteConfig.name}, ${name}! Hai să-ți arătăm pașii următori.`}
    >
      <Text style={emailStyles.heading}>Bun venit, {name}!</Text>

      <Text style={emailStyles.paragraph}>
        Te-ai înscris pentru modul nostru de pregătire pentru BAC informatică
        prin certificările Certiport. Suntem alături de tine.
      </Text>

      <Text style={emailStyles.paragraphMuted}>
        Iată ce-ți recomandăm să faci în următoarele 24 de ore:
      </Text>

      <Section style={emailStyles.card}>
        <Text
          style={{
            ...emailStyles.paragraph,
            margin: "0 0 8px 0",
            fontWeight: 600,
          }}
        >
          1. Începe cu Python
        </Text>
        <Text style={{ ...emailStyles.paragraphMuted, margin: "0" }}>
          E primul pas din pathway. Lecțiile 1 și 2 sunt gratuite — testează
          dacă stilul nostru ți se potrivește.
        </Text>
      </Section>

      <Section style={emailStyles.card}>
        <Text
          style={{
            ...emailStyles.paragraph,
            margin: "0 0 8px 0",
            fontWeight: 600,
          }}
        >
          2. Stabilește-ți un ritm
        </Text>
        <Text style={{ ...emailStyles.paragraphMuted, margin: "0" }}>
          1–2 ore pe zi e suficient. 30 de minute zilnic bate 4 ore o dată pe
          săptămână.
        </Text>
      </Section>

      <Section style={emailStyles.card}>
        <Text
          style={{
            ...emailStyles.paragraph,
            margin: "0 0 8px 0",
            fontWeight: 600,
          }}
        >
          3. Întreabă orice, oricând
        </Text>
        <Text style={{ ...emailStyles.paragraphMuted, margin: "0" }}>
          Răspundem la fiecare email. Adesea în câteva ore, de obicei în 24h
          lucrătoare.
        </Text>
      </Section>

      <Section style={{ marginTop: "32px", textAlign: "center" }}>
        <Button
          href={`${siteConfig.url}/dashboard`}
          style={emailStyles.buttonPrimary}
        >
          Deschide dashboard-ul
        </Button>
      </Section>

      <Text style={{ ...emailStyles.paragraphMuted, marginTop: "32px" }}>
        Suntem real, nu chatbot. Dacă ai întrebări, răspunde direct la
        emailul ăsta — ajunge la noi.
      </Text>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = { name: "Andrei" } satisfies WelcomeEmailProps;

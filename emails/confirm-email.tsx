import { Button, Link, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { siteConfig } from "@/lib/site";

interface ConfirmEmailProps {
  name: string;
  confirmUrl: string;
}

export default function ConfirmEmail({ name, confirmUrl }: ConfirmEmailProps) {
  return (
    <EmailLayout preview="Confirmă-ți emailul ca să activezi contul InfoBac.">
      <Text style={emailStyles.heading}>Salut, {name}!</Text>

      <Text style={emailStyles.paragraph}>
        Mai e un singur pas. Confirmă că ești tu — așa ne asigurăm că nu
        cineva s-a înregistrat cu adresa ta.
      </Text>

      <Section style={{ margin: "32px 0", textAlign: "center" }}>
        <Button href={confirmUrl} style={emailStyles.buttonPrimary}>
          Confirmă emailul
        </Button>
      </Section>

      <Text style={emailStyles.paragraphMuted}>
        Sau copiază link-ul ăsta în browser dacă butonul nu merge:
      </Text>
      <Text
        style={{
          ...emailStyles.paragraphMuted,
          wordBreak: "break-all",
          margin: "0 0 24px 0",
        }}
      >
        <Link href={confirmUrl} style={emailStyles.link}>
          {confirmUrl}
        </Link>
      </Text>

      <Text style={emailStyles.paragraphMuted}>
        Linkul e valid 24 de ore. Dacă nu ai cerut tu acest email, ignoră-l
        — nimeni nu va putea folosi adresa ta.
      </Text>

      <Text style={{ ...emailStyles.paragraphMuted, marginTop: "24px" }}>
        — Echipa {siteConfig.name}
      </Text>
    </EmailLayout>
  );
}

ConfirmEmail.PreviewProps = {
  name: "Andrei",
  confirmUrl: "https://infobac.md/auth/callback?code=preview",
} satisfies ConfirmEmailProps;

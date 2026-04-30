import { Button, Link, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { siteConfig } from "@/lib/site";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Resetează-ți parola InfoBac.">
      <Text style={emailStyles.heading}>Salut, {name}.</Text>

      <Text style={emailStyles.paragraph}>
        Am primit o cerere de resetare a parolei pentru contul tău. Apasă
        butonul de mai jos ca să setezi o parolă nouă.
      </Text>

      <Section style={{ margin: "32px 0", textAlign: "center" }}>
        <Button href={resetUrl} style={emailStyles.buttonPrimary}>
          Resetează parola
        </Button>
      </Section>

      <Text style={emailStyles.paragraphMuted}>
        Sau copiază în browser:
      </Text>
      <Text
        style={{
          ...emailStyles.paragraphMuted,
          wordBreak: "break-all",
          margin: "0 0 24px 0",
        }}
      >
        <Link href={resetUrl} style={emailStyles.link}>
          {resetUrl}
        </Link>
      </Text>

      <Text style={emailStyles.paragraphMuted}>
        <strong style={{ color: "#0f172a" }}>Important:</strong> link-ul
        expiră în 1 oră. Dacă nu ai cerut tu această resetare, ignoră acest
        email — parola ta rămâne neschimbată.
      </Text>

      <Text style={{ ...emailStyles.paragraphMuted, marginTop: "24px" }}>
        — Echipa {siteConfig.name}
      </Text>
    </EmailLayout>
  );
}

ResetPasswordEmail.PreviewProps = {
  name: "Andrei",
  resetUrl: "https://infobac.md/auth/callback?code=preview&type=recovery",
} satisfies ResetPasswordEmailProps;

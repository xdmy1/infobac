import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { emailBrand } from "@/lib/email-brand";
import { siteConfig } from "@/lib/site";

interface SubscriptionExpiringEmailProps {
  name: string;
  daysLeft: 1 | 2 | 3;
  plan: "Basic" | "Standard";
  expiresOn: string;
}

export default function SubscriptionExpiringEmail({
  name,
  daysLeft,
  plan,
  expiresOn,
}: SubscriptionExpiringEmailProps) {
  return (
    <EmailLayout
      preview={`Abonamentul tău ${plan} expiră în ${daysLeft} ${daysLeft === 1 ? "zi" : "zile"}.`}
    >
      <Text style={emailStyles.heading}>Hei, {name} —</Text>

      <Text style={emailStyles.paragraph}>
        Doar îți dăm de știre: abonamentul tău <strong>{plan}</strong>{" "}
        expiră{" "}
        {daysLeft === 1
          ? "mâine"
          : daysLeft === 2
            ? "în 2 zile"
            : "în 3 zile"}
        , pe <strong>{expiresOn}</strong>.
      </Text>

      <Text style={emailStyles.paragraphMuted}>
        Dacă reînnoiești înainte, accesul tău nu se întrerupe — continui de
        unde ai rămas.
      </Text>

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
          💡 Sugestie: trec la Lifetime
        </Text>
        <Text style={{ ...emailStyles.paragraphMuted, margin: "0" }}>
          Pentru 1.999 MDL one-time (≈100 EUR), ai acces pe viață + un cont
          extra pentru frate/soră. Dacă te pregătești 2+ luni, e mai ieftin
          decât abonamentul lunar.
        </Text>
      </Section>

      <Section style={{ margin: "24px 0", textAlign: "center" }}>
        <Button
          href={`${siteConfig.url}/abonament`}
          style={emailStyles.buttonPrimary}
        >
          Reînnoiește acum
        </Button>
      </Section>

      <Text style={emailStyles.paragraphMuted}>
        Nu vrei să continui?{" "}
        <a href={`${siteConfig.url}/abonament`} style={emailStyles.link}>
          Anulează
        </a>{" "}
        oricând. Nu te taxăm fără permisiunea ta.
      </Text>
    </EmailLayout>
  );
}

SubscriptionExpiringEmail.PreviewProps = {
  name: "Andrei",
  daysLeft: 3,
  plan: "Standard",
  expiresOn: "3 mai 2026",
} satisfies SubscriptionExpiringEmailProps;

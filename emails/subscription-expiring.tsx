import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "./components/email-layout";
import { siteConfig } from "@/lib/site";

interface SubscriptionExpiringEmailProps {
  name: string;
  daysLeft: 1 | 2 | 3;
  plan: string;
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

      <Section style={emailStyles.card}>
        <Text style={{...emailStyles.paragraph, fontWeight: 600, margin: "0 0 8px 0"}}>
          💡 Sugestie: planul „Pe 6 luni"
        </Text>
        <Text style={{...emailStyles.paragraphMuted, margin: 0}}>
          Pentru 950 MDL plată unică ai acces 6 luni la toate cursurile —
          efectiv ~158 MDL/lună, cea mai bună valoare per lună.
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
  plan: "Toate modulele",
  expiresOn: "3 mai 2026",
} satisfies SubscriptionExpiringEmailProps;

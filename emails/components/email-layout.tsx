import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";
import { emailBrand } from "@/lib/email-brand";

const { colors, fontFamily, containerMaxWidth } = emailBrand;

const main = {
  backgroundColor: colors.background,
  fontFamily,
  margin: "0",
  padding: "32px 16px",
};

const container = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  margin: "0 auto",
  maxWidth: containerMaxWidth,
  padding: "40px 32px",
};

const brandHeader = {
  marginBottom: "32px",
  textAlign: "left" as const,
};

const brandWordmark = {
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  margin: "0",
  color: colors.foreground,
};

const brandAccent = {
  color: colors.accentDark,
  fontWeight: 900,
  marginRight: "2px",
};

const footer = {
  borderTop: `1px solid ${colors.border}`,
  marginTop: "40px",
  paddingTop: "24px",
};

const footerText = {
  color: colors.mutedForeground,
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0 0 6px 0",
};

const footerLink = {
  color: colors.foreground,
  textDecoration: "underline",
};

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
  hideFooter?: boolean;
}

export function EmailLayout({
  preview,
  children,
  hideFooter,
}: EmailLayoutProps) {
  return (
    <Html lang="ro">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={brandWordmark}>
              <span style={brandAccent}>&gt;</span>
              {siteConfig.name.toLowerCase()}
            </Text>
          </Section>

          {children}

          {!hideFooter && (
            <>
              <Hr style={footer} />
              <Section>
                <Text style={footerText}>
                  {siteConfig.name} · Pregătire BAC informatică pentru elevii
                  din Moldova.
                </Text>
                <Text style={footerText}>
                  Chișinău, Moldova ·{" "}
                  <Link
                    href={`mailto:${siteConfig.contact.email}`}
                    style={footerLink}
                  >
                    {siteConfig.contact.email}
                  </Link>
                </Text>
                <Text style={footerText}>
                  Acest email e tranzacțional — nu poate fi dezabonat.
                </Text>
              </Section>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

// -----------------------------------------------------------------------------
// Shared style fragments for use inside templates
// -----------------------------------------------------------------------------

export const emailStyles = {
  heading: {
    color: colors.foreground,
    fontFamily,
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: "32px",
    margin: "0 0 16px 0",
  } as const,
  paragraph: {
    color: colors.foreground,
    fontFamily,
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px 0",
  } as const,
  paragraphMuted: {
    color: colors.mutedForeground,
    fontFamily,
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 16px 0",
  } as const,
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: "10px",
    color: colors.primaryForeground,
    display: "inline-block",
    fontFamily,
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 24px",
    textAlign: "center" as const,
    textDecoration: "none",
  } as const,
  buttonSecondary: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    color: colors.foreground,
    display: "inline-block",
    fontFamily,
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 20px",
    textAlign: "center" as const,
    textDecoration: "none",
  } as const,
  card: {
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "16px 20px",
    margin: "16px 0",
  } as const,
  divider: {
    borderTop: `1px solid ${colors.border}`,
    margin: "24px 0",
  } as const,
  link: {
    color: colors.primary,
    textDecoration: "underline",
  } as const,
};

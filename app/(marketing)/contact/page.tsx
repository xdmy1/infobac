import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  TelegramIcon,
} from "@/components/shared/social-icons";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Scrie-ne despre orice — întrebări, parteneriate, presa. Răspundem în câteva ore. Echipa InfoBac.md, Chișinău, Moldova.",
  alternates: { canonical: "/contact" },
};

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YoutubeIcon },
  { label: "Telegram", href: siteConfig.social.telegram, Icon: TelegramIcon },
] as const;

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24 lg:px-8 lg:py-28">
          <Reveal staggerChildren={0.1} className="max-w-3xl">
            <RevealItem variant="fade-up">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact · Chișinău, MD
              </p>
            </RevealItem>
            <RevealItem variant="fade-blur">
              <h1 className="mt-4 text-balance text-5xl font-bold leading-[1] tracking-tight md:text-6xl lg:text-[5.5rem]">
                Scrie-ne.{" "}
                <span className="italic text-muted-foreground">
                  Răspundem rapid.
                </span>
              </h1>
            </RevealItem>
            <RevealItem variant="fade-up">
              <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                Răspundem la fiecare email — adesea în câteva ore. Promitem să
                nu te punem să aștepți zile.
              </p>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variant="fade-up" delay={0.1} className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-foreground/5 md:p-8">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal
              staggerChildren={0.1}
              delay={0.3}
              className="space-y-8 lg:col-span-5"
            >
              <RevealItem variant="fade-up">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Direct
                  </h2>
                  <ul className="mt-4 space-y-4">
                    <ContactRow
                      icon={Mail}
                      label="Email"
                      value={
                        <a
                          href={`mailto:${siteConfig.contact.email}`}
                          className="font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          {siteConfig.contact.email}
                        </a>
                      }
                      sub="Răspundem în câteva ore lucrătoare"
                    />
                    <ContactRow
                      icon={MapPin}
                      label="Locație"
                      value={
                        <span className="font-medium text-foreground">
                          {siteConfig.contact.address}
                        </span>
                      }
                      sub="Echipa lucrează 100% remote din MD"
                    />
                    <ContactRow
                      icon={Clock}
                      label="Timp de răspuns"
                      value={
                        <span className="font-medium text-foreground">
                          Sub 4 ore lucrătoare
                        </span>
                      }
                      sub="Suport prioritar pentru abonați Standard / Lifetime"
                    />
                  </ul>
                </div>
              </RevealItem>

              <RevealItem variant="fade-up">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Social
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Pentru update-uri, mini-lecții și răspunsuri publice — ne
                    găsești și pe rețelele de mai jos.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {socials.map(({ label, href, Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          <Icon className="size-3.5" />
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="text-sm">{value}</div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </li>
  );
}

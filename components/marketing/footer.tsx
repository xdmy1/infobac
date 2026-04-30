import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  TelegramIcon,
} from "@/components/shared/social-icons";
import { siteConfig } from "@/lib/site";
import { footerNav, localeOptions } from "@/lib/nav";

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YoutubeIcon },
  { label: "Telegram", href: siteConfig.social.telegram, Icon: TelegramIcon },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:pr-8">
            <Logo height={32} />
            <p className="text-pretty max-w-xs text-sm text-muted-foreground">
              Pregătire BAC informatică pentru elevii din Moldova. 100% online,
              în ritmul tău.
            </p>
            <div className="flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={footerNav.product.title} links={footerNav.product.links} />
          <FooterColumn title={footerNav.company.title} links={footerNav.company.links} />
          <FooterColumn title={footerNav.legal.title} links={footerNav.legal.links} />
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            © {year} {siteConfig.name}. Făcut în Chișinău, Moldova.
          </p>

          <div
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label="Selectare limbă (în curând)"
          >
            {localeOptions.map((opt, i) => (
              <span key={opt.code} className="inline-flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="rounded px-1.5 py-0.5 font-medium uppercase tracking-wider transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 data-[active=true]:text-foreground"
                  data-active={opt.code === "ro"}
                  title={opt.code === "ro" ? "Română (activă)" : `${opt.label} — în curând`}
                >
                  {opt.label}
                </button>
                {i < localeOptions.length - 1 && (
                  <span aria-hidden className="opacity-40">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

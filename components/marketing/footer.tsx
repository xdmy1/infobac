import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  TelegramIcon,
} from "@/components/shared/social-icons";
import { siteConfig } from "@/lib/site";
import { footerNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

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
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          <div className="col-span-2 space-y-4 lg:col-span-1 lg:pr-6">
            <Logo height={30} />
            <p className="text-pretty max-w-sm text-sm text-muted-foreground">
              Pregătire BAC informatică pentru elevii din Moldova. 100% online,
              în ritmul tău.
            </p>
            <address className="not-italic text-sm text-muted-foreground">
              <span className="block">{siteConfig.fullName}</span>
              <span className="block">{siteConfig.contact.address}</span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="block transition-colors hover:text-foreground"
              >
                {siteConfig.contact.email}
              </a>
            </address>
            <div className="flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-9"
                >
                  <Icon className="size-[18px] sm:size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title={footerNav.product.title}
            links={footerNav.product.links}
          />
          <FooterColumn
            title={footerNav.company.title}
            links={footerNav.company.links}
          />
          <FooterColumn
            title={footerNav.legal.title}
            links={footerNav.legal.links}
            className="col-span-2 lg:col-span-1"
          />
        </div>

        <div className="mt-10 space-y-3 border-t border-border pt-6 md:mt-12 md:pt-8">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {year} {siteConfig.name}. Făcut în Chișinău, Moldova.
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground/80 sm:text-xs">
            InfoBac e o platformă independentă de educație în tehnologia
            informației. Nu suntem afiliați, sponsorizați sau aprobați
            oficial de Certiport, Pearson VUE, Microsoft sau alți deținători
            de mărci comerciale menționați. Numele lor sunt folosite
            descriptiv pentru a indica subiectele predate și certificările
            disponibile independent.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
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

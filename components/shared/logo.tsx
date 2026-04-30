import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type LogoVariant = "full" | "icon" | "stacked";

const VARIANTS: Record<
  LogoVariant,
  { light: string; dark: string; aspect: number; defaultHeight: number }
> = {
  full: {
    light: "/brand/logo.svg",
    dark: "/brand/logo-dark.svg",
    aspect: 340 / 100,
    defaultHeight: 32,
  },
  icon: {
    light: "/brand/icon.svg",
    dark: "/brand/icon-dark.svg",
    aspect: 64 / 80,
    defaultHeight: 32,
  },
  stacked: {
    light: "/brand/logo-stacked.svg",
    dark: "/brand/logo-stacked-dark.svg",
    aspect: 200 / 160,
    defaultHeight: 80,
  },
};

interface LogoProps {
  variant?: LogoVariant;
  /** Logo height in px. Width auto-derived from variant aspect ratio. */
  height?: number;
  /** Wrap in next/link. Pass null to render as plain inline element. */
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "full",
  height,
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const config = VARIANTS[variant];
  const finalHeight = height ?? config.defaultHeight;
  const finalWidth = Math.round(finalHeight * config.aspect);
  const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

  const content = (
    <>
      <Image
        src={config.light}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        priority={priority}
        className="block dark:hidden"
        style={{ height: finalHeight, width: "auto" }}
      />
      <Image
        src={config.dark}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        priority={priority}
        className="hidden dark:block"
        style={{ height: finalHeight, width: "auto" }}
      />
    </>
  );

  if (href === null) {
    return (
      <span className={cn("inline-flex shrink-0 items-center", className)}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} — pagina principală`}
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-80",
        className
      )}
    >
      {content}
    </Link>
  );
}

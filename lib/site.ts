export const siteConfig = {
  name: "InfoBac",
  fullName: "InfoBac.md",
  tagline: "10 din oficiu la BAC informatică",
  description:
    "Platformă online de pregătire pentru certificările Certiport. Acceptat oficial de MEC pentru echivalarea probei de informatică la BAC. Făcut de elevi pentru elevi în Chișinău.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://infobac.md",
  locale: "ro-MD",
  ogImage: "/og.png",
  contact: {
    email: "hello@infobac.md",
    address: "Chișinău, Moldova",
  },
  social: {
    instagram: "https://instagram.com/infobac.md",
    tiktok: "https://tiktok.com/@infobac.md",
    youtube: "https://youtube.com/@infobac",
    telegram: "https://t.me/infobac",
  },
  keywords: [
    "bac informatică moldova",
    "certiport moldova",
    "10 din oficiu bac",
    "pregătire bac informatică",
    "IT specialist certificare",
    "bac 2026 informatică",
    "python bac moldova",
    "sql bac moldova",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

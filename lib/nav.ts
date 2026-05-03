export const marketingNav = [
  { label: "Cursuri", href: "/cursuri" },
  { label: "Pathway", href: "/#pathway" },
  { label: "Blog", href: "/blog" },
  { label: "Prețuri", href: "/preturi" },
  { label: "FAQ", href: "/faq" },
] as const;

// Footer links must point to LIVE pages — sitewide 404s hurt indexing. Only
// add an entry once the page exists.
export const footerNav = {
  product: {
    title: "Produs",
    links: [
      { label: "Cursuri", href: "/cursuri" },
      { label: "Prețuri", href: "/preturi" },
      { label: "Pathway", href: "/#pathway" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  company: {
    title: "Companie",
    links: [
      { label: "Despre noi", href: "/despre" },
      { label: "Blog", href: "/blog" },
      { label: "RSS", href: "/rss.xml" },
      { label: "Contact", href: "/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Termeni și condiții", href: "/legal/termeni" },
      { label: "Confidențialitate", href: "/legal/confidentialitate" },
    ],
  },
} as const;

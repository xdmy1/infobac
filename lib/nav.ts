export const marketingNav = [
  { label: "Cursuri", href: "/cursuri" },
  { label: "Pathway", href: "/#pathway" },
  { label: "Blog", href: "/blog" },
  { label: "Prețuri", href: "/preturi" },
  { label: "FAQ", href: "/faq" },
] as const;

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
      { label: "Contact", href: "/contact" },
      { label: "Carieră", href: "/cariera" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Termeni și condiții", href: "/legal/termeni" },
      { label: "Confidențialitate", href: "/legal/confidentialitate" },
      { label: "Politica de refund", href: "/legal/refund" },
      { label: "GDPR", href: "/legal/gdpr" },
    ],
  },
} as const;


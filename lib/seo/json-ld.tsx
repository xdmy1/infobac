import { siteConfig } from "@/lib/site";
import {
  pathway,
  pricingPlans,
  type FaqItem,
  type PathwayStep,
  type PricingPlan,
} from "@/lib/content";

// =============================================================================
// JSON-LD primitives
// =============================================================================
// Each helper returns a single <script type="application/ld+json"> element so
// callers can compose schemas freely. Builders return objects when used by
// composite renderers (e.g. the homepage emits 3+ blocks at once).
// =============================================================================

function stringify(obj: unknown) {
  return JSON.stringify(obj);
}

function slugifyAuthor(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// -----------------------------------------------------------------------------
// Organization (used as `publisher` reference everywhere)
// -----------------------------------------------------------------------------
export function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.fullName,
    legalName: siteConfig.fullName,
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/brand/logo.svg`,
      width: 512,
      height: 128,
    },
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.geo.addressLocality,
      addressCountry: siteConfig.geo.addressCountry,
      postalCode: siteConfig.geo.postalCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Moldova",
      },
      {
        "@type": "AdministrativeArea",
        name: "Chișinău",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      contactType: "customer support",
      availableLanguage: ["Romanian", "Russian", "English"],
      areaServed: "MD",
    },
    sameAs: Object.values(siteConfig.social),
    knowsAbout: [
      "BAC informatică Moldova",
      "Certiport IT Specialist certifications",
      "Python programming",
      "SQL databases",
      "Computer networking",
      "IT exam preparation",
    ],
  };
}

export function buildWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    alternateName: siteConfig.fullName,
    description: siteConfig.description,
    inLanguage: "ro-MD",
    publisher: { "@id": `${siteConfig.url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// -----------------------------------------------------------------------------
// Course
// -----------------------------------------------------------------------------
export function buildCourse(step: PathwayStep) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteConfig.url}/cursuri#${step.slug}`,
    name: step.certName,
    alternateName: step.title,
    description: step.description,
    url: `${siteConfig.url}/cursuri`,
    image: `${siteConfig.url}${step.image}`,
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}#organization`,
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    educationalLevel: "secondary",
    educationalCredentialAwarded: `Certiport ${step.certName}`,
    inLanguage: "ro-MD",
    isAccessibleForFree: false,
    teaches: step.title,
    about: step.title,
    courseCode: `IT-${step.examLetter}`,
    timeRequired: step.duration,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: step.duration,
      inLanguage: "ro-MD",
    },
    offers: {
      "@type": "Offer",
      category: "Subscription",
      price: 250,
      priceCurrency: "MDL",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/preturi`,
    },
  };
}

export function CourseJsonLd({ step }: { step: PathwayStep }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(buildCourse(step)) }}
    />
  );
}

export function CoursesJsonLd({ steps = pathway }: { steps?: readonly PathwayStep[] }) {
  return (
    <>
      {steps.map((s) => (
        <CourseJsonLd key={s.slug} step={s} />
      ))}
    </>
  );
}

// -----------------------------------------------------------------------------
// BreadcrumbList
// -----------------------------------------------------------------------------
export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbCrumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${siteConfig.url}${it.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(data) }}
    />
  );
}

// -----------------------------------------------------------------------------
// FAQPage
// -----------------------------------------------------------------------------
export function FaqPageJsonLd({ items }: { items: readonly FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ro-MD",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[itemprop='name']", "[itemprop='acceptedAnswer']"],
    },
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
        inLanguage: "ro-MD",
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(data) }}
    />
  );
}

// -----------------------------------------------------------------------------
// WebPage — generic schema for static content pages (legal, despre, contact).
// Pairs with BreadcrumbList to give Google a richer entity graph.
// -----------------------------------------------------------------------------
export interface WebPageSeo {
  path: string; // e.g. "/despre" or "/legal/termeni"
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}

export function WebPageJsonLd({ page }: { page: WebPageSeo }) {
  const url = `${siteConfig.url}${page.path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "ro-MD",
    isPartOf: { "@id": `${siteConfig.url}#website` },
    publisher: { "@id": `${siteConfig.url}#organization` },
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(data) }}
    />
  );
}

// -----------------------------------------------------------------------------
// Article (blog posts)
// -----------------------------------------------------------------------------
export interface ArticleSeo {
  url: string; // canonical absolute URL
  title: string;
  description: string;
  image?: string;
  datePublished: string; // ISO
  dateModified: string;
  authorName: string;
  section?: string;
  tags?: string[];
}

export function ArticleJsonLd({ article }: { article: ArticleSeo }) {
  const personId = `${siteConfig.url}/despre#${slugifyAuthor(article.authorName)}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${article.url}#article`,
    headline: article.title,
    description: article.description,
    image: article.image
      ? [article.image]
      : [`${siteConfig.url}${siteConfig.ogImage}`],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      "@id": personId,
      name: article.authorName,
      url: `${siteConfig.url}/despre`,
      worksFor: { "@id": `${siteConfig.url}#organization` },
    },
    isPartOf: { "@id": `${siteConfig.url}#website` },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/brand/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    articleSection: article.section,
    keywords: article.tags?.join(", "),
    inLanguage: "ro-MD",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(data) }}
    />
  );
}

// -----------------------------------------------------------------------------
// Blog (collection page)
// -----------------------------------------------------------------------------
export interface BlogPostRef {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  authorName: string;
}

export function BlogJsonLd({
  posts,
  url,
  title,
  description,
}: {
  posts: BlogPostRef[];
  url: string;
  title: string;
  description: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: title,
    description,
    url,
    inLanguage: "ro-MD",
    publisher: { "@id": `${siteConfig.url}#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: p.url,
      datePublished: p.datePublished,
      author: { "@type": "Person", name: p.authorName },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(data) }}
    />
  );
}

// -----------------------------------------------------------------------------
// HowTo — narrates the 3-step pathway. Eligible for HowTo rich result.
// -----------------------------------------------------------------------------
export function buildHowTo() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cum iei 10 din oficiu la BAC informatică în Moldova",
    description:
      "Pașii concreți pentru a-ți susține pregătirea în vederea probei de informatică din BAC prin 3 certificări Certiport IT Specialist, internațional recunoscute.",
    totalTime: "P8W",
    inLanguage: "ro-MD",
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "MDL",
      value: "950",
    },
    supply: pathway.map((s) => ({
      "@type": "HowToSupply",
      name: s.certName,
    })),
    step: pathway.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `${s.title} — ${s.certName}`,
      text: s.description,
      url: `${siteConfig.url}/cursuri#${s.slug}`,
      image: `${siteConfig.url}${s.image}`,
    })),
  };
}

export function HowToJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(buildHowTo()) }}
    />
  );
}

// -----------------------------------------------------------------------------
// ItemList — used on /cursuri to mark up the course catalog as a list.
// -----------------------------------------------------------------------------
export function ItemListJsonLd({
  items,
  name,
  description,
}: {
  items: { url: string; name: string; description?: string }[];
  name: string;
  description?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url.startsWith("http") ? it.url : `${siteConfig.url}${it.url}`,
      name: it.name,
      description: it.description,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(data) }}
    />
  );
}

// -----------------------------------------------------------------------------
// Offers / Product — emits one Product per pricing plan with its Offer. Lets
// Google render price-rich SERP results for branded "infobac preturi" queries.
// -----------------------------------------------------------------------------
function buildOffer(plan: PricingPlan) {
  const eligibleDuration =
    plan.priceUnit === "6 luni"
      ? { "@type": "QuantitativeValue", value: 6, unitCode: "MON" }
      : { "@type": "QuantitativeValue", value: 1, unitCode: "MON" };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteConfig.url}/preturi#${plan.id}`,
    name: `InfoBac · ${plan.name}`,
    description: plan.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "Online education",
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    url: `${siteConfig.url}/preturi`,
    offers: {
      "@type": "Offer",
      price: plan.priceMDL,
      priceCurrency: "MDL",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/preturi`,
      seller: { "@id": `${siteConfig.url}#organization` },
      eligibleDuration,
      areaServed: { "@type": "Country", name: "Moldova" },
    },
  };
}

export function OffersJsonLd({
  plans = pricingPlans,
}: {
  plans?: readonly PricingPlan[];
} = {}) {
  return (
    <>
      {plans.map((p) => (
        <script
          key={p.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringify(buildOffer(p)) }}
        />
      ))}
    </>
  );
}

// -----------------------------------------------------------------------------
// Convenience composite for the homepage
// -----------------------------------------------------------------------------
export function HomepageJsonLd() {
  // Single @graph emission — cleaner entity disambiguation than separate
  // <script> tags. Google links @id references inside the graph, building
  // a richer knowledge-panel-eligible entity profile.
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganization(),
      buildWebsite(),
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}#webpage`,
        url: siteConfig.url,
        name: `${siteConfig.fullName} — ${siteConfig.tagline}`,
        description: siteConfig.description,
        inLanguage: "ro-MD",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        about: { "@id": `${siteConfig.url}#organization` },
        primaryImageOfPage: `${siteConfig.url}${siteConfig.ogImage}`,
      },
      buildHowTo(),
      ...pathway.map((s) => buildCourse(s)),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringify(graph) }}
    />
  );
}

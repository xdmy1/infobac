import { siteConfig } from "@/lib/site";
import { pathway, type FaqItem, type PathwayStep } from "@/lib/content";

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
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo.svg`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chișinău",
      addressCountry: "MD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      contactType: "customer support",
      availableLanguage: ["Romanian", "Russian", "English"],
    },
    sameAs: Object.values(siteConfig.social),
  };
}

export function buildWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "ro-MD",
    publisher: { "@id": `${siteConfig.url}#organization` },
  };
}

// -----------------------------------------------------------------------------
// Course
// -----------------------------------------------------------------------------
export function buildCourse(step: PathwayStep) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: step.certName,
    description: step.description,
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    educationalLevel: "secondary",
    inLanguage: "ro",
    isAccessibleForFree: false,
    teaches: step.title,
    courseCode: `IT-${step.examLetter}`,
    timeRequired: step.duration,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: step.duration,
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
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
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
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image
      ? [article.image]
      : [`${siteConfig.url}${siteConfig.ogImage}`],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.authorName,
      url: `${siteConfig.url}/despre`,
    },
    publisher: {
      "@type": "Organization",
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
// Convenience composite for the homepage
// -----------------------------------------------------------------------------
export function HomepageJsonLd() {
  const org = buildOrganization();
  const site = buildWebsite();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringify(site) }}
      />
      <CoursesJsonLd />
    </>
  );
}

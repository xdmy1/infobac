import { siteConfig } from "@/lib/site";
import { pathway } from "@/lib/content";

/**
 * JSON-LD structured data for the homepage.
 * Helps Google understand we are an EducationalOrganization with concrete
 * Course offerings, located in Chișinău, Moldova.
 */
export function JsonLd() {
  const organization = {
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

  const courses = pathway.map((step) => ({
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
  }));

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "ro-MD",
    publisher: { "@id": `${siteConfig.url}#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      {courses.map((c, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(c) }}
        />
      ))}
    </>
  );
}

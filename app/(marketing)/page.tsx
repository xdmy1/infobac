import { Hero } from "@/components/marketing/hero";
import { WhyUs } from "@/components/marketing/why-us";
import { Pathway } from "@/components/marketing/pathway";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaFinal } from "@/components/marketing/cta-final";
import { JsonLd } from "@/components/shared/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <WhyUs />
      <Pathway />
      <Features />
      <Pricing />
      <Testimonials />
      <FaqSection />
      <CtaFinal />
    </>
  );
}

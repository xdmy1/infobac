import { redirect } from "next/navigation";
import { Hero } from "@/components/marketing/hero";
import { WhyUs } from "@/components/marketing/why-us";
import { Pathway } from "@/components/marketing/pathway";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";
import { FaqSection } from "@/components/marketing/faq-section";
import { BlogStrip } from "@/components/marketing/blog-strip";
import { CtaFinal } from "@/components/marketing/cta-final";
import { JsonLd } from "@/components/shared/json-ld";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error_description?: string }>;
}) {
  // Defensive: if Supabase falls back to Site URL after OAuth (e.g. when the
  // Redirect URLs allowlist is misconfigured), the user lands here with the
  // OAuth `code` in the query string. Forward to our callback so the session
  // exchange + redirect to /dashboard still happens.
  const params = await searchParams;
  if (params.code || params.error_description) {
    const qs = new URLSearchParams();
    if (params.code) qs.set("code", params.code);
    if (params.error_description) {
      qs.set("error_description", params.error_description);
    }
    qs.set("next", "/dashboard");
    redirect(`/auth/callback?${qs.toString()}`);
  }

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
      <BlogStrip />
      <CtaFinal />
    </>
  );
}

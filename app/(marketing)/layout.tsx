import { Navbar } from "@/components/marketing/navbar";
import { TrialBar } from "@/components/marketing/trial-bar";
import { Footer } from "@/components/marketing/footer";
import { shouldOfferTrial } from "@/lib/queries/trial";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isLoggedIn = false;
  // Signed-out visitors still get the offer — they just sign up first. It is
  // hidden only for someone who has already taken it or already paid.
  let offerTrial = false;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = !!user;
      offerTrial = await shouldOfferTrial(supabase);
    } catch {
      isLoggedIn = false;
      offerTrial = false;
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Above the navbar and in normal flow, so it scrolls away while the
          sticky navbar stays docked. */}
      {offerTrial && <TrialBar />}
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isLoggedIn = false;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = !!user;
    } catch {
      isLoggedIn = false;
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

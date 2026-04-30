import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/user";
import { isPreviewMode } from "@/lib/preview-mode";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isPreviewMode || !isSupabaseConfigured) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Pending payments count for the nav badge.
  const { count } = await supabase
    .from("payment_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const pendingPaymentsCount = count ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-6 md:pt-8 lg:px-8">
      <AdminNav pendingPaymentsCount={pendingPaymentsCount} />
      {children}
    </div>
  );
}

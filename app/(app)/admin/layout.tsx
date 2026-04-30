import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/user";
import { isPreviewMode } from "@/lib/preview-mode";

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

  return <>{children}</>;
}

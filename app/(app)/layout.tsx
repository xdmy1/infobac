import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries/user";
import { getMyCourses } from "@/lib/queries/courses";
import {
  isPreviewMode,
  previewUser,
  previewProfile,
  previewCourses,
} from "@/lib/preview-mode";
import { DesktopSidebar, MobileSidebarTrigger } from "@/components/app/sidebar";
import { UserMenu } from "@/components/app/user-menu";
import { PreviewBanner } from "@/components/app/preview-banner";
import { ThemeToggle } from "@/components/shared/theme-toggle";

// Authenticated routes depend on the request cookie/session — never prerender.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string;
  let userMetaName: string | undefined;
  let avatarUrl: string | null;
  let myCoursesData: { slug: string; title: string; icon: string }[];

  if (isPreviewMode) {
    userEmail = previewUser.email;
    userMetaName = previewUser.user_metadata.full_name;
    avatarUrl = previewProfile.avatar_url;
    myCoursesData = previewCourses.map((c) => ({
      slug: c.slug,
      title: c.title,
      icon: c.icon,
    }));
  } else {
    if (!isSupabaseConfigured) {
      redirect("/login?supabase_missing=1");
    }

    const supabase = await createClient();
    const user = await getCurrentUser(supabase);
    if (!user) {
      redirect("/login");
    }

    const [profile, myCourses] = await Promise.all([
      getCurrentProfile(supabase),
      getMyCourses(supabase),
    ]);

    userEmail = user.email ?? "";
    userMetaName =
      profile?.full_name ??
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0];
    avatarUrl = profile?.avatar_url ?? null;
    myCoursesData = myCourses.map((c) => ({
      slug: c.slug,
      title: c.title,
      icon: c.icon,
    }));
  }

  const fullName = userMetaName ?? "Utilizator";

  return (
    <div className="flex min-h-dvh bg-background">
      <DesktopSidebar myCourses={myCoursesData} />

      <div className="flex flex-1 flex-col">
        {isPreviewMode && <PreviewBanner />}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <MobileSidebarTrigger myCourses={myCoursesData} />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserMenu
              fullName={fullName}
              email={userEmail}
              avatarUrl={avatarUrl}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

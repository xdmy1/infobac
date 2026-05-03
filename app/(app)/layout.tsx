import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries/user";
import { allCoursesMeta } from "@/lib/content/courses";
import {
  isPreviewMode,
  previewUser,
  previewProfile,
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
  let isAdmin = false;
  let myCoursesData: { slug: string; title: string; icon: string }[];

  // The course list in the sidebar comes straight from the static content
  // registry — every signed-in user sees all 3 courses there. Real "access
  // granted" gating happens at the lesson level, not in the sidebar.
  myCoursesData = allCoursesMeta.map((c) => ({
    slug: c.slug,
    title: c.title.split(" — ")[0],
    icon: c.icon,
  }));

  if (isPreviewMode) {
    userEmail = previewUser.email;
    userMetaName = previewUser.user_metadata.full_name;
    avatarUrl = previewProfile.avatar_url;
  } else {
    if (!isSupabaseConfigured) {
      redirect("/login?supabase_missing=1");
    }

    const supabase = await createClient();
    const user = await getCurrentUser(supabase);
    if (!user) {
      redirect("/login");
    }

    const profile = await getCurrentProfile(supabase);

    userEmail = user.email ?? "";
    userMetaName =
      profile?.full_name ??
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0];
    avatarUrl = profile?.avatar_url ?? null;
    isAdmin = profile?.role === "admin";
  }

  const fullName = userMetaName ?? "Utilizator";

  return (
    // The outer flex grows naturally with content so the body itself is the
    // page's scroll container. Sidebar uses sticky top-0 to stay docked while
    // the rest scrolls.
    <div className="flex w-full bg-background">
      <DesktopSidebar myCourses={myCoursesData} isAdmin={isAdmin} />

      {/* min-w-0 is critical — without it a flex child grows past the
          viewport when its descendants contain wide content (e.g. long
          code blocks in a lesson), forcing the whole page to scroll
          horizontally on mobile. */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        {isPreviewMode && <PreviewBanner />}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <MobileSidebarTrigger myCourses={myCoursesData} isAdmin={isAdmin} />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserMenu
              fullName={fullName}
              email={userEmail}
              avatarUrl={avatarUrl}
            />
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

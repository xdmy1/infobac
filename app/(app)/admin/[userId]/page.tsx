import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserDetail } from "@/lib/queries/admin";
import { UserDetailCard } from "@/components/admin/user-detail-card";

export const metadata: Metadata = {
  title: "Utilizator · Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const supabase = await createClient();
  const detail = await getUserDetail(supabase, userId);
  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Toți utilizatorii
      </Link>

      <UserDetailCard data={detail} />
    </div>
  );
}

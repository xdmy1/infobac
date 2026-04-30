import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listAllUsers } from "@/lib/queries/admin";
import { UsersTable } from "@/components/admin/users-table";

export const metadata: Metadata = {
  title: "Admin",
  description: "Tablou de control pentru administratori.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createClient();
  const users = await listAllUsers(supabase);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <header className="mb-8 flex flex-col gap-2 md:mb-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Admin
        </p>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Utilizatori
          </h1>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {users.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Suspendă acces, trimite reminder de plată sau intră în detalii pentru
          fiecare cont.
        </p>
      </header>

      <UsersTable users={users} />
    </div>
  );
}

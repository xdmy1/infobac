import Link from "next/link";
import type { AdminUserSummary } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanLabels } from "@/lib/supabase/types";
import { UserActionsMenu } from "@/components/admin/user-actions-menu";
import { cn } from "@/lib/utils";

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days < 1) return "azi";
  if (days < 2) return "ieri";
  if (days < 30) return `${days} zile`;
  if (days < 365) return `${Math.round(days / 30)} luni`;
  return `${Math.round(days / 365)} ani`;
}

function planBadge(sub: AdminUserSummary["latestSubscription"]) {
  if (!sub) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        fără plan
      </Badge>
    );
  }
  const label = SubscriptionPlanLabels[sub.plan] ?? sub.plan;
  const tone =
    sub.status === "active" || sub.status === "trialing"
      ? "border-success/30 bg-success/10 text-success"
      : "border-muted-foreground/20 bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={cn("font-mono text-[10px]", tone)}>
      {label} · {sub.status}
    </Badge>
  );
}

export function UsersTable({ users }: { users: AdminUserSummary[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <p className="text-sm font-medium">Niciun utilizator încă.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Userii vor apărea aici imediat ce se înregistrează.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-mono">Utilizator</th>
              <th className="px-4 py-3 font-mono">Plan</th>
              <th className="px-4 py-3 font-mono">Cursuri</th>
              <th className="px-4 py-3 font-mono">Best</th>
              <th className="px-4 py-3 font-mono">Activ</th>
              <th className="w-12 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.profile.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/20"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/${u.profile.id}`}
                    className="block leading-tight"
                  >
                    <span className="block font-medium text-foreground hover:underline">
                      {u.profile.full_name}
                    </span>
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {u.profile.email}
                    </span>
                  </Link>
                  {u.profile.role === "admin" ? (
                    <Badge
                      variant="outline"
                      className="mt-1 border-primary/30 bg-primary/10 font-mono text-[10px] text-primary"
                    >
                      admin
                    </Badge>
                  ) : null}
                </td>
                <td className="px-4 py-3">{planBadge(u.latestSubscription)}</td>
                <td className="px-4 py-3 font-mono tabular-nums">
                  {u.accessCount}/{u.totalCourses}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums">
                  {u.bestScore !== null ? `${u.bestScore}%` : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {formatRelative(u.lastActivityAt)}
                </td>
                <td className="px-2 py-3 text-right">
                  <UserActionsMenu
                    userId={u.profile.id}
                    userName={u.profile.full_name}
                    hasAccess={u.accessCount > 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

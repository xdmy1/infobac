"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavProps {
  /** Number of pending payment requests, shown as a badge on the Plăți tab. */
  pendingPaymentsCount: number;
}

interface Item {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Match the path with === or startsWith. */
  match: "exact" | "startsWith";
}

export function AdminNav({ pendingPaymentsCount }: AdminNavProps) {
  const pathname = usePathname();

  const items: Item[] = [
    {
      href: "/admin",
      label: "Utilizatori",
      icon: <Users className="size-3.5" />,
      match: "exact",
    },
    {
      href: "/admin/plati",
      label: "Plăți",
      icon: <Receipt className="size-3.5" />,
      match: "startsWith",
    },
  ];

  return (
    <nav className="mb-7 flex flex-wrap items-center gap-1 border-b border-border md:mb-8">
      {items.map((item) => {
        const active =
          item.match === "exact"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const isPlati = item.href === "/admin/plati";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.icon}
            {item.label}
            {isPlati && pendingPaymentsCount > 0 && (
              <span className="ml-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-warning/20 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-warning">
                {pendingPaymentsCount}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

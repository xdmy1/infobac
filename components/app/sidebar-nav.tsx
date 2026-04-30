"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarCourse {
  slug: string;
  title: string;
  icon: string;
}

interface SidebarNavProps {
  myCourses: SidebarCourse[];
  /** Optional callback fired when a link is clicked — used by mobile Sheet to close itself. */
  onNavigate?: () => void;
}

const mainNav: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Progres", href: "/progres", icon: LineChart },
  { label: "Abonament", href: "/abonament", icon: CreditCard },
  { label: "Setări", href: "/setari", icon: Settings },
];

export function SidebarNav({ myCourses, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      <ul className="flex flex-col gap-0.5">
        {mainNav.map((item) => (
          <li key={item.href}>
            <SidebarLink
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Cursurile mele
        </p>
        {myCourses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Niciun curs încă.
            </p>
            <Link
              href="/preturi"
              onClick={onNavigate}
              className="mt-1 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Vezi prețuri
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {myCourses.map((course) => {
              const href = `/curs/${course.slug}`;
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={course.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <CourseIcon
                      slug={course.slug}
                      src={course.icon}
                      size={18}
                      alt=""
                    />
                    <span className="truncate">{course.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: SidebarItem & { active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

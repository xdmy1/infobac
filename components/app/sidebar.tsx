"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { SidebarNav } from "./sidebar-nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  myCourses: { slug: string; title: string; icon: string }[];
  isAdmin?: boolean;
}

export function DesktopSidebar({ myCourses, isAdmin }: SidebarProps) {
  return (
    // sticky top-0 + h-dvh keeps the sidebar pinned in the viewport while the
    // rest of the column scrolls. self-start prevents flex from stretching it
    // to match the (taller) main column's height.
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 self-start border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo height={28} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav myCourses={myCourses} isAdmin={isAdmin} />
      </div>
    </aside>
  );
}

export function MobileSidebarTrigger({ myCourses, isAdmin }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Deschide meniu"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 md:hidden"
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 sm:max-w-xs">
        <SheetHeader className="flex h-16 flex-row items-center border-b border-border px-5">
          <SheetTitle className="text-left">
            <Logo height={28} href={null} />
          </SheetTitle>
          <SheetDescription className="sr-only">
            Meniu navigație aplicație
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto">
          <SidebarNav
            myCourses={myCourses}
            isAdmin={isAdmin}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

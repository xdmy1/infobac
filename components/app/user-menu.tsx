"use client";

import Link from "next/link";
import { LogOut, Settings, CreditCard, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/actions/auth";

interface UserMenuProps {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

function initialsFrom(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function UserMenu({ fullName, email, avatarUrl }: UserMenuProps) {
  const initials = initialsFrom(fullName) || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Meniu utilizator"
        className="inline-flex items-center gap-2 rounded-full p-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Avatar className="size-8">
          {avatarUrl ? null : (
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="hidden text-sm font-medium md:inline">
          {fullName.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              {fullName}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/setari" />}>
          <User className="size-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/abonament" />}>
          <CreditCard className="size-4" />
          Abonament
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/setari" />}>
          <Settings className="size-4" />
          Setări
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <form action={logoutAction} className="contents">
          <DropdownMenuItem
            render={<button type="submit" />}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

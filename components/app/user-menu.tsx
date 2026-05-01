"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export function UserMenu({ fullName, email }: UserMenuProps) {
  const initials = initialsFrom(fullName) || "?";
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Meniu utilizator"
        className="inline-flex items-center gap-2 rounded-full p-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium md:inline">
          {fullName.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <div className="flex flex-col px-2 py-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {fullName}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          render={<button type="button" onClick={handleLogout} />}
        >
          <LogOut className="size-4" />
          {isPending ? "Se deconectează…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

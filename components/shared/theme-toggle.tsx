"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Laptop },
] as const;

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "pointer-events-none opacity-0"
        )}
      >
        <Sun className="size-4" />
      </span>
    );
  }

  const showMoon = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Schimbă tema"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 rounded-full"
        )}
      >
        <Sun
          className={cn(
            "size-4 transition-all",
            showMoon ? "scale-0 -rotate-90" : "scale-100 rotate-0"
          )}
        />
        <Moon
          className={cn(
            "absolute size-4 transition-all",
            showMoon ? "scale-100 rotate-0" : "scale-0 rotate-90"
          )}
        />
        <span className="sr-only">Schimbă tema</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        {OPTIONS.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="gap-2"
          >
            <Icon className="size-4" />
            <span>{label}</span>
            {theme === value ? (
              <Check className="ml-auto size-3.5 opacity-70" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

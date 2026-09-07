"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * One-click light/dark switch.
 *
 * Toggles against the *resolved* theme, so the first click always flips what
 * the user currently sees — even when the theme is "system". Renders an inert
 * placeholder until mounted, since the resolved theme isn't known during SSR
 * and rendering the wrong icon would flash on hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 rounded-full pointer-events-none opacity-0",
          className,
        )}
      >
        <Sun className="size-4" />
      </span>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Comută pe modul luminos" : "Comută pe modul întunecat"}
      title={isDark ? "Mod luminos" : "Mod întunecat"}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative size-9 rounded-full",
        className,
      )}
    >
      <Sun
        className={cn(
          "size-4 transition-all duration-300",
          isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0",
        )}
      />
      <Moon
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark ? "scale-100 rotate-0" : "scale-0 rotate-90",
        )}
      />
    </button>
  );
}

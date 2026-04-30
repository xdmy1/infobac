"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ArrowRight, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { marketingNav } from "@/lib/nav";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[border-color,background-color,backdrop-filter] duration-200",
        scrolled
          ? "border-b border-border/70 bg-background/75 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 md:px-6 lg:px-8">
        <Logo height={26} priority />

        <nav className="hidden items-center gap-1 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-1.5 md:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants(),
                "h-8 gap-1.5 px-3.5 text-[13px] font-medium"
              )}
            >
              <span className="pointer-events-none inline-flex items-center gap-1.5">
                <LayoutDashboard className="size-3.5" strokeWidth={2} />
                Dashboard
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-8 px-3 text-[13px]"
                )}
              >
                <span className="pointer-events-none">Login</span>
              </Link>
              <Link
                href="/inregistrare"
                className={cn(
                  buttonVariants(),
                  "h-8 gap-1.5 px-3.5 text-[13px] font-medium"
                )}
              >
                <span className="pointer-events-none inline-flex items-center gap-1.5">
                  Creează cont
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              aria-label="Deschide meniu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-8"
              )}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo height={26} href={null} />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Meniu de navigație principal
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-0.5 px-3">
                {marketingNav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ))}
              </nav>

              <Separator className="my-2" />

              <div className="flex flex-col gap-2 px-4 pb-4">
                {isLoggedIn ? (
                  <SheetClose
                    render={
                      <Link
                        href="/dashboard"
                        className={cn(
                          buttonVariants(),
                          "h-10 w-full gap-2 text-sm"
                        )}
                      >
                        <LayoutDashboard className="size-4" strokeWidth={2} />
                        Dashboard
                      </Link>
                    }
                  />
                ) : (
                  <>
                    <SheetClose
                      render={
                        <Link
                          href="/login"
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "h-10 w-full text-sm"
                          )}
                        >
                          Login
                        </Link>
                      }
                    />
                    <SheetClose
                      render={
                        <Link
                          href="/inregistrare"
                          className={cn(
                            buttonVariants(),
                            "h-10 w-full gap-2 text-sm"
                          )}
                        >
                          Creează cont
                          <ArrowRight className="size-3.5" />
                        </Link>
                      }
                    />
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

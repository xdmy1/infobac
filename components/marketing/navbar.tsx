"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";
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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Logo height={32} priority />

        <nav className="hidden items-center gap-1 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 px-3 text-sm"
            )}
          >
            Login
          </Link>
          <Link
            href="/inregistrare"
            className={cn(
              buttonVariants(),
              "h-9 gap-1.5 px-4 text-sm font-medium"
            )}
          >
            Creează cont
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              aria-label="Deschide meniu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-9"
              )}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo height={28} href={null} />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Meniu de navigație principal
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-3">
                {marketingNav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ))}
              </nav>

              <Separator className="my-2" />

              <div className="flex flex-col gap-2 px-4 pb-4">
                <SheetClose
                  render={
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-11 w-full text-base"
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
                        "h-11 w-full gap-2 text-base"
                      )}
                    >
                      Începe acum
                      <ArrowRight className="size-4" />
                    </Link>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

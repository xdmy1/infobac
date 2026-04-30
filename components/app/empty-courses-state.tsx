import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyCoursesState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center md:p-12">
      <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-5" />
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight md:text-2xl">
        Niciun curs activ încă.
      </h3>
      <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground md:text-base">
        Alege un plan ca să-ți activăm accesul la cursurile pe care vrei să
        le faci. Poți începe cu unul singur și să adaugi celelalte mai
        târziu.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/preturi"
          className={cn(
            buttonVariants(),
            "h-11 gap-2 px-5 text-sm font-medium"
          )}
        >
          Vezi prețuri
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/cursuri"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-11 px-5 text-sm font-medium"
          )}
        >
          Vezi ce cursuri avem
        </Link>
      </div>
    </div>
  );
}

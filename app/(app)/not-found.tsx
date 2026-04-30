import Link from "next/link";
import { Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center md:py-24">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
        Nu am găsit asta.
      </h1>
      <p className="mt-4 text-pretty text-sm text-muted-foreground md:text-base">
        Pagina, cursul sau lecția nu există — sau nu ai încă acces la ea.
        Verifică din dashboard sau pornește o căutare nouă.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants(),
            "h-10 gap-2 px-5 text-sm font-medium"
          )}
        >
          <Home className="size-4" />
          Dashboard
        </Link>
        <Link
          href="/cursuri"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 gap-2 px-5 text-sm font-medium"
          )}
        >
          <Search className="size-4" />
          Vezi cursurile
        </Link>
      </div>
    </div>
  );
}

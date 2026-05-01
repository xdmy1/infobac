import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTA({
  title,
  description,
  href,
  label = "Vezi prețuri",
}: {
  title: string;
  description?: string;
  href: string;
  label?: string;
}) {
  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card to-card p-6 md:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Următorul pas
      </p>
      <h3 className="mt-2 text-balance text-xl font-bold tracking-tight md:text-2xl">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-prose text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "mt-5 h-11 gap-2 px-6 text-sm font-semibold",
        )}
      >
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}

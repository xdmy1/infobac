import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/marketing/blog-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function BlogStrip() {
  const posts = (await listAllPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Citește pe blog
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ghiduri despre BAC informatică și Certiport.
            </h2>
          </div>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 gap-1.5 self-start text-xs md:self-auto",
            )}
          >
            Toate articolele
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} highlighted={p.isPillar} />
          ))}
        </div>
      </div>
    </section>
  );
}

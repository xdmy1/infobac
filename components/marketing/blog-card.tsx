import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  ghid: "Ghid",
  certiport: "Certiport",
  examene: "Examene",
  python: "Python",
  sql: "SQL",
  devices: "Devices",
  comparatie: "Comparație",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ro-MD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function BlogCard({
  post,
  highlighted = false,
}: {
  post: BlogPostMeta;
  highlighted?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md md:p-6",
        highlighted ? "border-primary/30" : "border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "font-mono text-[10px]",
            highlighted
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-muted/50 text-muted-foreground",
          )}
        >
          {CATEGORY_LABELS[post.category] ?? post.category}
        </Badge>
        {post.isPillar ? (
          <Badge
            variant="outline"
            className="border-accent/40 bg-accent/10 font-mono text-[10px] text-accent-hover"
          >
            pillar
          </Badge>
        ) : null}
      </div>

      <h3 className="text-balance text-base font-bold leading-tight tracking-tight md:text-lg">
        {post.title}
      </h3>

      <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">
        {post.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
        <span className="font-mono">{formatDate(post.publishedAt)}</span>
        <span className="inline-flex items-center gap-1 font-mono">
          <Clock className="size-3" />
          {post.readingMinutes} min
          <ArrowRight className="ml-2 size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

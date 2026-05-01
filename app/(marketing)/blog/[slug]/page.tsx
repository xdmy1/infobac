import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  type ArticleSeo,
} from "@/lib/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/blog/Callout";
import { CTA } from "@/components/blog/CTA";
import { Stat, StatGrid } from "@/components/blog/Stat";
import { Compare } from "@/components/blog/Compare";
import { BlogCard } from "@/components/marketing/blog-card";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  ghid: "Ghid",
  certiport: "Certiport",
  examene: "Examene",
  python: "Python",
  sql: "SQL",
  devices: "Devices",
  comparatie: "Comparație",
};

const mdxComponents = {
  Callout,
  CTA,
  Stat,
  StatGrid,
  Compare,
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.meta.slug}`;
  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.tags,
    alternates: { canonical: `/blog/${post.meta.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url,
      type: "article",
      publishedTime: post.meta.publishedAt,
      modifiedTime: post.meta.updatedAt,
      authors: [post.meta.author],
      tags: post.meta.tags,
      locale: "ro_MD",
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ro-MD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const url = `${siteConfig.url}/blog/${post.meta.slug}`;

  const seo: ArticleSeo = {
    url,
    title: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.publishedAt,
    dateModified: post.meta.updatedAt,
    authorName: post.meta.author,
    section: CATEGORY_LABELS[post.meta.category],
    tags: post.meta.tags,
    image: post.meta.ogImage ?? undefined,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-10 md:px-6 md:pb-32 md:pt-14 lg:px-8">
      <ArticleJsonLd article={seo} />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.meta.title, url: `/blog/${post.meta.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Acasă
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/blog" className="hover:text-foreground">
          Blog
        </Link>
        <ChevronRight className="size-3" />
        <span className="truncate text-foreground">
          {post.meta.title.length > 40
            ? post.meta.title.slice(0, 38) + "…"
            : post.meta.title}
        </span>
      </nav>

      {/* Header */}
      <header className="mt-6 border-b border-border pb-6 md:mt-8 md:pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-[10px]",
              post.meta.isPillar
                ? "border-accent/40 bg-accent/10 text-accent-hover"
                : "border-primary/30 bg-primary/10 text-primary",
            )}
          >
            {CATEGORY_LABELS[post.meta.category] ?? post.meta.category}
          </Badge>
          {post.meta.isPillar ? (
            <Badge
              variant="outline"
              className="border-foreground/15 bg-muted/40 font-mono text-[10px] text-muted-foreground"
            >
              Pillar article
            </Badge>
          ) : null}
        </div>

        <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
          {post.meta.title}
        </h1>

        <p className="mt-4 max-w-prose text-pretty text-base text-muted-foreground md:text-lg">
          {post.meta.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            de{" "}
            <span className="font-medium text-foreground">
              {post.meta.author}
            </span>
          </span>
          <span aria-hidden>·</span>
          <span>publicat {formatDate(post.meta.publishedAt)}</span>
          {post.meta.updatedAt !== post.meta.publishedAt ? (
            <>
              <span aria-hidden>·</span>
              <span>actualizat {formatDate(post.meta.updatedAt)}</span>
            </>
          ) : null}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.meta.readingMinutes} min de citit
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-bold prose-h3:mt-8 prose-h3:text-xl prose-h3:font-semibold prose-p:text-pretty prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary-hover prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:bg-muted/50 prose-li:my-1 prose-blockquote:border-l-accent prose-blockquote:bg-muted/40 prose-blockquote:not-italic">
        <MDXRemote
          source={post.body}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-lg font-bold tracking-tight md:text-xl">
            Citește și
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Toate articolele
        </Link>
      </div>
    </article>
  );
}

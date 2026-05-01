import type { Metadata } from "next";
import { listAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/marketing/blog-card";
import { siteConfig } from "@/lib/site";
import {
  BlogJsonLd,
  BreadcrumbJsonLd,
  type BlogPostRef,
} from "@/lib/seo/json-ld";

const TITLE = "Blog · BAC informatică, Certiport și 10 din oficiu";
const DESCRIPTION =
  "Ghiduri, comparații și pași concreți pentru BAC-ul de informatică din Moldova: cum funcționează echivalarea Certiport, ce examene dai și cum iei 10 din oficiu.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await listAllPosts();
  const pillars = posts.filter((p) => p.isPillar);
  const supporting = posts.filter((p) => !p.isPillar);

  const refs: BlogPostRef[] = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    datePublished: p.publishedAt,
    authorName: p.author,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 md:px-6 md:pb-32 md:pt-16 lg:px-8">
      <BlogJsonLd
        posts={refs}
        url={`${siteConfig.url}/blog`}
        title={TITLE}
        description={DESCRIPTION}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />

      <header className="mb-10 max-w-2xl md:mb-14">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Blog · {posts.length} articole
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          Despre BAC informatică, Certiport și{" "}
          <span className="bg-gradient-to-br from-accent to-accent-hover bg-clip-text text-transparent">
            10 din oficiu
          </span>
          .
        </h1>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">
          Ghiduri scrise de elevi care au trecut prin asta, fără marketing
          gol. Pornește cu un articol pillar dacă ești la început, sau
          mergi direct la subiectul tău.
        </p>
      </header>

      {pillars.length > 0 && (
        <section className="mb-12 md:mb-16">
          <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight md:text-xl">
              Articole pillar
            </h2>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {pillars.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <BlogCard key={p.slug} post={p} highlighted />
            ))}
          </div>
        </section>
      )}

      {supporting.length > 0 && (
        <section>
          <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight md:text-xl">
              Mai mult
            </h2>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {supporting.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supporting.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

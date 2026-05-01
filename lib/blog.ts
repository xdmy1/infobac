import "server-only";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogCategory =
  | "ghid"
  | "certiport"
  | "examene"
  | "python"
  | "sql"
  | "devices"
  | "comparatie";

export interface BlogFrontmatter {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  isPillar?: boolean;
  related?: string[];
  ogImage?: string | null;
}

export interface BlogPostMeta extends BlogFrontmatter {
  readingMinutes: number;
}

export interface BlogPost {
  meta: BlogPostMeta;
  body: string;
}

let cache: BlogPostMeta[] | null = null;

async function readAll(): Promise<BlogPost[]> {
  const files = await fs.readdir(BLOG_DIR);
  const mdx = files.filter((f) => f.endsWith(".mdx"));
  const out: BlogPost[] = [];
  for (const file of mdx) {
    const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as BlogFrontmatter;
    const stats = readingTime(content);
    out.push({
      meta: { ...fm, readingMinutes: Math.max(1, Math.round(stats.minutes)) },
      body: content,
    });
  }
  return out;
}

export async function listAllPosts(): Promise<BlogPostMeta[]> {
  if (cache) return cache;
  const all = await readAll();
  const sorted = all
    .map((p) => p.meta)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  cache = sorted;
  return sorted;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    const fm = data as BlogFrontmatter;
    const stats = readingTime(content);
    return {
      meta: { ...fm, readingMinutes: Math.max(1, Math.round(stats.minutes)) },
      body: content,
    };
  } catch {
    return null;
  }
}

export async function getRelatedPosts(
  slug: string,
  limit = 3,
): Promise<BlogPostMeta[]> {
  const all = await listAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const explicit = (current.related ?? [])
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is BlogPostMeta => !!p);

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const seen = new Set([slug, ...explicit.map((p) => p.slug)]);
  const sameCategory = all.filter(
    (p) => !seen.has(p.slug) && p.category === current.category,
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

export async function getAllSlugs(): Promise<string[]> {
  const all = await listAllPosts();
  return all.map((p) => p.slug);
}

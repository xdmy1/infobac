import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  markdown: string;
  className?: string;
}

/**
 * Server-side rendered Markdown body for lessons. Styling lives here
 * (no @tailwindcss/typography dep) — adjust tokens once and they apply
 * to every lesson.
 */
export function LessonContent({ markdown, className }: LessonContentProps) {
  if (!markdown.trim()) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Conținutul acestei lecții va fi adăugat în curând.
        </p>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "max-w-none text-pretty",
        // Headings
        "[&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight",
        // Paragraphs
        "[&_p]:my-4 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground",
        "[&_p]:text-pretty",
        // Lists
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6",
        "[&_li]:text-base [&_li]:leading-relaxed",
        // Inline code
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5",
        "[&_code]:font-mono [&_code]:text-[0.875em]",
        // Code blocks
        "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl",
        "[&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm",
        // Blockquote
        "[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40",
        "[&_blockquote]:bg-primary/5 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:pr-3",
        "[&_blockquote]:rounded-r-md [&_blockquote_p]:my-1 [&_blockquote_p]:text-muted-foreground",
        // Links
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_a:hover]:text-primary-hover",
        // Tables
        "[&_table]:my-5 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-border",
        "[&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold",
        "[&_td]:border-t [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm",
        // Strong / em
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic",
        // Horizontal rule
        "[&_hr]:my-8 [&_hr]:border-border",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}

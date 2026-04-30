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
        // The wrapper itself must be width-constrained so long code lines
        // can scroll instead of pushing the viewport.
        "w-full max-w-full min-w-0 overflow-hidden text-pretty",
        // Headings — slightly smaller on mobile so they fit
        "[&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight md:[&_h1]:text-3xl",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight md:[&_h2]:mt-10 md:[&_h2]:text-2xl",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:tracking-tight md:[&_h3]:mt-8 md:[&_h3]:text-lg",
        // Paragraphs
        "[&_p]:my-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-foreground md:[&_p]:text-base",
        "[&_p]:text-pretty [&_p]:break-words",
        // Lists
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 md:[&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 md:[&_ol]:pl-6",
        "[&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:break-words md:[&_li]:text-base",
        // Inline code — stays on one line but wraps at word boundaries
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5",
        "[&_code]:font-mono [&_code]:text-[0.875em] [&_code]:break-words",
        // Code blocks — must scroll horizontally on mobile so long lines
        // don't push the layout. max-w + overflow-x-auto + the parent
        // overflow-hidden together keep them contained.
        "[&_pre]:my-5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl",
        "[&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-3 md:[&_pre]:p-4",
        "[&_pre]:text-[12.5px] md:[&_pre]:text-sm",
        "[&_pre_code]:whitespace-pre [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[inherit]",
        // Blockquote
        "[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40",
        "[&_blockquote]:bg-primary/5 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:pr-3",
        "[&_blockquote]:rounded-r-md [&_blockquote_p]:my-1 [&_blockquote_p]:text-muted-foreground",
        // Links
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:break-words",
        "[&_a:hover]:text-primary-hover",
        // Tables — wrap in a scrollable container so wide tables don't
        // overflow the viewport. The inner table keeps proper styling.
        "[&_table]:my-5 [&_table]:block [&_table]:w-full [&_table]:max-w-full",
        "[&_table]:overflow-x-auto [&_table]:rounded-lg [&_table]:border [&_table]:border-border",
        "[&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:whitespace-nowrap",
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

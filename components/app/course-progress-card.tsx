"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { CountUp } from "@/components/shared/count-up";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";

interface CourseProgressCardProps {
  slug: string;
  title: string;
  icon: string;
  estimatedDuration: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  expiresAt: string | null;
}

function formatExpires(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ro-MD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CourseProgressCard({
  slug,
  title,
  icon,
  estimatedDuration,
  totalLessons,
  completedLessons,
  percent,
  expiresAt,
}: CourseProgressCardProps) {
  const hasContent = totalLessons > 0;
  const formattedExpiry = formatExpires(expiresAt);

  return (
    <SpotlightCard
      glowColor="color-mix(in oklab, var(--primary) 35%, transparent)"
      className="block h-full rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      <Link
        href={`/curs/${slug}`}
        className="group flex h-full flex-col gap-4 p-5 md:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              whileHover={{ rotate: 4, scale: 1.05 }}
              transition={{ type: "spring", damping: 15, stiffness: 220 }}
              className="inline-flex shrink-0"
            >
              <CourseIcon slug={slug} src={icon} size={36} alt="" />
            </motion.span>
            <div>
              <h3 className="text-lg font-bold tracking-tight">{title}</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {estimatedDuration || "Durată flexibilă"}
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-muted-foreground">Progres</span>
            <span className="font-mono font-bold tabular-nums text-foreground">
              {hasContent ? (
                <>
                  <CountUp to={percent} />%
                </>
              ) : (
                "—"
              )}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover"
              initial={{ width: 0 }}
              whileInView={{ width: hasContent ? `${percent}%` : "0%" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 1.4,
                ease: [0.21, 0.47, 0.32, 0.98],
                delay: 0.2,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {hasContent ? (
              <>
                <span className="font-medium text-foreground">
                  {completedLessons}
                </span>{" "}
                din {totalLessons} lecții
              </>
            ) : (
              <span className="italic">Conținutul va fi adăugat în curând.</span>
            )}
          </p>
        </div>

        {formattedExpiry && (
          <p className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <BookOpen className="size-3" />
            Acces până la {formattedExpiry}
          </p>
        )}
      </Link>
    </SpotlightCard>
  );
}

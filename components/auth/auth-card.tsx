"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  /** Footer content (e.g. „Ai cont? Login"). */
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  footer,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Înapoi la pagina principală
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        className={cn(
          "w-full max-w-md rounded-3xl border border-border bg-card/95 p-7 shadow-2xl shadow-foreground/10 backdrop-blur-md md:p-9",
          className
        )}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.3 },
            },
          }}
          className="mb-7 flex flex-col items-center gap-4 text-center"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <Logo height={32} />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.7 }}
            className="space-y-1.5"
          >
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="text-pretty text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {children}
        </motion.div>

        {footer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground"
          >
            {footer}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

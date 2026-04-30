"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Marquee } from "@/components/shared/marquee";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import { testimonials, type Testimonial } from "@/lib/content";

const avatarBgs = [
  "bg-primary/15 text-primary",
  "bg-accent/30 text-foreground",
  "bg-warning/15 text-foreground",
  "bg-success/15 text-success",
  "bg-destructive/15 text-destructive",
];

// Build a longer list by repeating + light variations so the marquee
// has enough content to feel infinite without obvious seams.
const expandedTestimonials = [
  ...testimonials,
  ...testimonials,
];

export function Testimonials() {
  return (
    <section className="relative border-t border-border bg-muted/20 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal
          staggerChildren={0.12}
          className="mx-auto max-w-3xl text-center"
        >
          <RevealItem variant="fade-up">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mărturii
            </p>
          </RevealItem>
          <RevealItem variant="fade-blur">
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Elevi care au reușit.
            </h2>
          </RevealItem>
          <RevealItem variant="fade-up">
            <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">
              Mărturii de la primii absolvenți care au luat 10 din oficiu.
            </p>
          </RevealItem>
        </Reveal>
      </div>

      <Reveal
        variant="fade-in"
        delay={0.3}
        className="mt-16 md:mt-20"
      >
        <Marquee duration={50} gap="1.5rem" pauseOnHover>
          {expandedTestimonials.map((t, i) => (
            <TestimonialCard
              key={`${t.name}-${i}`}
              testimonial={t}
              avatarColor={avatarBgs[i % avatarBgs.length]}
            />
          ))}
        </Marquee>
      </Reveal>

      <Reveal
        delay={0.4}
        variant="fade-up"
        className="mx-auto mt-12 max-w-2xl px-4 text-center text-xs text-muted-foreground/80 md:px-6"
      >
        * Testimoniale ilustrative. Vor fi înlocuite cu mărturii reale după
        primii absolvenți (sesiunea iunie 2026).
      </Reveal>
    </section>
  );
}

function TestimonialCard({
  testimonial: t,
  avatarColor,
}: {
  testimonial: Testimonial;
  avatarColor: string;
}) {
  return (
    <article className="flex w-[360px] shrink-0 flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:w-[400px]">
      <div className="flex items-center gap-3">
        <Avatar className="size-11">
          <AvatarFallback className={cn("text-sm font-semibold", avatarColor)}>
            {t.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {t.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{t.school}</p>
        </div>
      </div>

      <div
        className="flex items-center gap-0.5"
        aria-label={`Rating ${t.rating} din 5 stele`}
      >
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            className="size-4 fill-warning text-warning"
            aria-hidden
            strokeWidth={1.5}
          />
        ))}
      </div>

      <blockquote className="line-clamp-5 text-pretty text-sm leading-relaxed text-foreground/90">
        „{t.quote}"
      </blockquote>

      <div className="mt-auto pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          {t.result}
        </span>
      </div>
    </article>
  );
}

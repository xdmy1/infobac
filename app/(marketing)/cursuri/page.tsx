import type { Metadata } from "next";
import Image from "next/image";
import { CoursesDetail } from "@/components/marketing/courses-detail";
import { Pathway } from "@/components/marketing/pathway";
import { CtaFinal } from "@/components/marketing/cta-final";
import { Reveal, RevealItem } from "@/components/shared/reveal";
import { courseSyllabi, pathway } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cursuri — Python, SQL, Networking pentru BAC",
  description:
    "Programa exactă a celor 3 certificări Certiport care echivalează nota 10 la BAC informatică. Topics, durată, format examen — totul transparent.",
  alternates: { canonical: "/cursuri" },
};

export default function CursuriPage() {
  // Compute aggregates from real syllabus data
  const totalTopics = pathway.reduce(
    (acc, step) => acc + courseSyllabi[step.slug].topics.length,
    0
  );
  const totalBullets = pathway.reduce(
    (acc, step) =>
      acc +
      courseSyllabi[step.slug].topics.reduce(
        (a, t) => a + t.bullets.length,
        0
      ),
    0
  );

  return (
    <>
      <CursuriHero totalTopics={totalTopics} totalBullets={totalBullets} />

      <CoursesDetail />

      <Pathway />
      <CtaFinal />
    </>
  );
}

function CursuriHero({
  totalTopics,
  totalBullets,
}: {
  totalTopics: number;
  totalBullets: number;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Background — soft horizontal gradient + grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(132, 204, 22, 0.10), transparent 60%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(79, 70, 229, 0.10), transparent 60%), linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at center, black 50%, transparent 90%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* TEXT — col-span-7 */}
          <div className="lg:col-span-7">
            <Reveal staggerChildren={0.1}>
              <RevealItem variant="fade-up">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cursuri · Programa Certiport
                </p>
              </RevealItem>
              <RevealItem variant="fade-blur">
                <h1 className="mt-4 text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-[5.5rem]">
                  Trei capitole.
                  <br />
                  <span className="bg-gradient-to-br from-accent to-accent-hover bg-clip-text text-transparent">
                    Trei certificări.
                  </span>
                  <br />
                  <span className="text-muted-foreground">10 din oficiu.</span>
                </h1>
              </RevealItem>
              <RevealItem variant="fade-up">
                <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                  Materia exactă pentru cele 3 examene Certiport IT Specialist.
                  Programa de mai jos e identică cu cea oficială — n-am adăugat
                  nimic, n-am scos nimic.
                </p>
              </RevealItem>

              {/* Stats row — pure numbers, editorial */}
              <RevealItem variant="fade-up">
                <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Capitole
                    </dt>
                    <dd className="mt-1 font-mono text-3xl font-bold tabular-nums md:text-4xl">
                      {totalTopics}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Sub-puncte
                    </dt>
                    <dd className="mt-1 font-mono text-3xl font-bold tabular-nums md:text-4xl">
                      {totalBullets}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Examen / cert
                    </dt>
                    <dd className="mt-1 font-mono text-3xl font-bold tabular-nums md:text-4xl">
                      40
                    </dd>
                  </div>
                </dl>
              </RevealItem>
            </Reveal>
          </div>

          {/* PNG CONSTELLATION — col-span-5 */}
          <div className="hidden lg:col-span-5 lg:block">
            <CourseConstellation />
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseConstellation() {
  const items = pathway.map((p) => ({
    slug: p.slug,
    title: p.title,
    duration: p.duration,
    examLetter: p.examLetter,
    image: p.image,
  }));

  // Hand-tuned positions — each course PNG floats at a different size + tilt.
  const layout: Array<{
    placement: React.CSSProperties;
    size: number;
    rotate: number;
  }> = [
    {
      placement: { top: "0%", left: "10%", zIndex: 2 },
      size: 180,
      rotate: -6,
    },
    {
      placement: { top: "32%", right: "0%", zIndex: 3 },
      size: 220,
      rotate: 8,
    },
    {
      placement: { bottom: "0%", left: "20%", zIndex: 1 },
      size: 170,
      rotate: -3,
    },
  ];

  return (
    <div className="relative h-[520px]">
      {items.map((item, i) => {
        const pos = layout[i];
        return (
          <Reveal
            key={item.slug}
            variant="scale-in"
            delay={0.2 + i * 0.15}
            duration={0.9}
            className="absolute"
            style={pos.placement}
          >
            <a
              href={`#${item.slug}`}
              className="group block"
              style={{ transform: `rotate(${pos.rotate}deg)` }}
            >
              <div
                className="relative rounded-3xl bg-card p-4 shadow-2xl ring-1 ring-border transition-all hover:rotate-0 hover:scale-105 hover:shadow-primary/20"
                style={{ width: pos.size, height: pos.size }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={pos.size}
                  height={pos.size}
                  className="h-full w-full object-contain"
                  unoptimized
                  priority={i === 0}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background shadow-lg">
                  {item.title}
                </div>
                <div className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-accent font-mono text-xs font-bold text-accent-foreground shadow-lg">
                  {item.examLetter}
                </div>
              </div>
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}

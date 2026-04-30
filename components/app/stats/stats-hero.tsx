import { TrendingUp, Target, Trophy, Flame } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

interface StatsHeroProps {
  overallAccuracy: number;
  totalQuestions: number;
  totalAttempts: number;
  bestScore: number;
}

/**
 * Big-numbers headline row at the top of the dashboard. Communicates
 * "where you stand" at a glance — accuracy percentage, total practice
 * volume, exams done, personal best.
 */
export function StatsHero({
  overallAccuracy,
  totalQuestions,
  totalAttempts,
  bestScore,
}: StatsHeroProps) {
  const accuracyTone = toneFor(overallAccuracy);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <HeroCard
        icon={<TrendingUp className="size-4" strokeWidth={2.25} />}
        label="Acuratețe generală"
        value={
          <>
            <CountUp to={overallAccuracy} />%
          </>
        }
        sub={
          totalQuestions > 0
            ? `pe ${totalQuestions} întrebări de examen`
            : "fă un examen ca să apară"
        }
        tone={accuracyTone}
        bigBackdrop
      />
      <HeroCard
        icon={<Target className="size-4" strokeWidth={2.25} />}
        label="Întrebări răspunse"
        value={<CountUp to={totalQuestions} />}
        sub={`în ${totalAttempts} examene`}
        tone="muted"
      />
      <HeroCard
        icon={<Trophy className="size-4" strokeWidth={2.25} />}
        label="Cel mai bun scor"
        value={
          bestScore > 0 ? (
            <>
              <CountUp to={bestScore} />%
            </>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        }
        sub={bestScore >= 70 ? "ai trecut pragul" : "țintește 70%+"}
        tone={bestScore > 0 ? toneFor(bestScore) : "muted"}
      />
      <HeroCard
        icon={<Flame className="size-4" strokeWidth={2.25} />}
        label="Examene date"
        value={<CountUp to={totalAttempts} />}
        sub={
          totalAttempts === 0
            ? "primul vine acum"
            : totalAttempts < 3
              ? "începutul e bun"
              : "constanță reală"
        }
        tone="muted"
      />
    </div>
  );
}

type Tone = "success" | "warning" | "destructive" | "muted";

function toneFor(pct: number): Tone {
  if (pct >= 80) return "success";
  if (pct >= 60) return "warning";
  if (pct > 0) return "destructive";
  return "muted";
}

function HeroCard({
  icon,
  label,
  value,
  sub,
  tone,
  bigBackdrop,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
  tone: Tone;
  bigBackdrop?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 md:p-5",
        tone === "success" && "border-success/30 bg-success/[0.04]",
        tone === "warning" && "border-warning/30 bg-warning/[0.04]",
        tone === "destructive" &&
          "border-destructive/30 bg-destructive/[0.04]",
        tone === "muted" && "border-border bg-card",
      )}
    >
      {bigBackdrop && tone !== "muted" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl",
            tone === "success" && "bg-success/20",
            tone === "warning" && "bg-warning/20",
            tone === "destructive" && "bg-destructive/20",
          )}
        />
      )}
      <div className="relative">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-lg",
              tone === "success" && "bg-success/15 text-success",
              tone === "warning" && "bg-warning/20 text-warning",
              tone === "destructive" && "bg-destructive/15 text-destructive",
              tone === "muted" && "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
        <p
          className={cn(
            "mt-2 font-mono text-3xl font-bold tabular-nums tracking-tight md:text-4xl",
            tone === "success" && "text-success",
            tone === "warning" && "text-warning",
            tone === "destructive" && "text-destructive",
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAnalyticsApiConfigured } from "@/lib/analytics/posthog-api";
import { getAnalytics, parsePeriod, PERIODS } from "@/lib/queries/analytics";
import {
  DataTable,
  Funnel,
  Panel,
  RankList,
  StatTile,
  formatDuration,
  formatNumber,
  num,
  str,
} from "@/components/admin/analytics/panels";
import { TrendChart } from "@/components/admin/analytics/trend-chart";

export const metadata: Metadata = {
  title: "Analitice",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ zile?: string }>;
}

const POSTHOG_APP = "https://eu.posthog.com";

export default async function AnaliticePage({ searchParams }: PageProps) {
  const { zile } = await searchParams;
  const days = parsePeriod(zile);

  if (!isAnalyticsApiConfigured) {
    return <SetupNotice />;
  }

  const a = await getAnalytics(days);

  const dailyPoints = (index: number) =>
    a.daily.rows.map((r) => ({ day: str(r[0]), value: num(r[index]) }));

  const f = a.funnel.rows[0] ?? [];
  const funnelSteps = [
    { label: "Au vizitat site-ul", value: num(f[0]) },
    { label: "Au apăsat pe un buton de cont", value: num(f[1]) },
    { label: "Și-au făcut cont", value: num(f[2]) },
    { label: "Au deschis o lecție", value: num(f[3]) },
    { label: "Au lovit paywall-ul", value: num(f[4]), hint: "Aici se decide plata" },
    { label: "Au deschis un plan", value: num(f[5]) },
    { label: "Au început plata", value: num(f[6]) },
    { label: "Au plătit", value: num(f[7]) },
  ];

  // Views and engagement come from different events; joined here by path so the
  // content table reads as one thing.
  const engagementByPath = new Map(
    a.pageEngagement.rows.map((r) => [
      str(r[0]),
      { seconds: num(r[1]), scroll: num(r[2]) },
    ]),
  );

  const conversion =
    a.kpis.signups > 0
      ? ((a.kpis.payments / a.kpis.signups) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Analitice
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            De unde vin, ce citesc, unde apasă, unde se opresc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-xl border border-border p-1">
            {PERIODS.map((p) => (
              <Link
                key={p}
                href={`/admin/analitice?zile=${p}`}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tabular-nums transition-colors",
                  days === p
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p}z
              </Link>
            ))}
          </nav>
          <a
            href={POSTHOG_APP}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            PostHog
            <ExternalLink className="size-3" />
          </a>
        </div>
      </header>

      {a.fatalError && (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {a.fatalError}
        </p>
      )}

      {/* ---- Headline numbers ---- */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Vizitatori" value={formatNumber(a.kpis.visitors)} />
        <StatTile label="Sesiuni" value={formatNumber(a.kpis.sessions)} />
        <StatTile label="Pagini văzute" value={formatNumber(a.kpis.pageviews)} />
        <StatTile
          label="Durată sesiune"
          value={formatDuration(a.kpis.avgSessionSeconds)}
          sub="media pe sesiune"
        />
        <StatTile
          label="Conturi noi"
          value={formatNumber(a.kpis.signups)}
          tone="good"
        />
        <StatTile
          label="Blocați de paywall"
          value={formatNumber(a.kpis.paywallHits)}
          tone="warn"
          sub="momentul deciziei"
        />
        <StatTile
          label="Plăți începute"
          value={formatNumber(a.kpis.checkoutsStarted)}
        />
        <StatTile
          label="Plăți reușite"
          value={formatNumber(a.kpis.payments)}
          tone="good"
          sub={`${conversion}% din conturi`}
        />
      </div>

      {/* ---- Over time ---- */}
      <Panel
        title="Evoluție zilnică"
        hint="Fiecare metrică pe scara ei — altfel plățile ar dispărea sub vizitatori."
        result={a.daily}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <TrendChart label="Vizitatori" points={dailyPoints(1)} />
          <TrendChart label="Pagini văzute" points={dailyPoints(2)} />
          <TrendChart label="Conturi noi" points={dailyPoints(3)} tone="primary" />
          <TrendChart label="Plăți" points={dailyPoints(4)} tone="success" />
        </div>
      </Panel>

      {/* ---- The funnel ---- */}
      <Panel
        title="Drumul spre plată"
        hint="Oameni, nu evenimente — cine lovește paywall-ul de șase ori e un om blocat, nu șase."
        result={a.funnel}
      >
        <Funnel steps={funnelSteps} />
      </Panel>

      {/* ---- Acquisition ---- */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="De unde vin"
          hint="Google nu trimite cuvintele căutate — pentru ele e Search Console."
          result={a.referrers}
        >
          <RankList
            rows={a.referrers.rows}
            valueIndex={1}
            secondaryIndex={2}
            secondaryLabel="oameni"
          />
        </Panel>

        <Panel
          title="Pe ce pagină intră"
          hint="Prima pagină a fiecărei vizite."
          result={a.entryPages}
        >
          <RankList rows={a.entryPages.rows} valueIndex={1} />
        </Panel>
      </div>

      {/* ---- Content ---- */}
      <Panel
        title="Ce citesc"
        hint="Timpul și scroll-ul sunt măsurate la ieșirea din pagină."
        result={a.topPages}
      >
        <DataTable
          headers={["Pagină", "Afișări", "Vizitatori", "Timp mediu", "Scroll"]}
          rows={a.topPages.rows}
          render={(r) => {
            const path = str(r[0]);
            const e = engagementByPath.get(path);
            return [
              <span key="p" className="font-mono text-xs">{path}</span>,
              <span key="v" className="font-mono text-xs tabular-nums">{formatNumber(num(r[1]))}</span>,
              <span key="u" className="font-mono text-xs tabular-nums text-muted-foreground">{formatNumber(num(r[2]))}</span>,
              <span key="t" className="font-mono text-xs tabular-nums">{e ? formatDuration(e.seconds) : "—"}</span>,
              <span key="s" className="font-mono text-xs tabular-nums text-muted-foreground">{e?.scroll ? `${Math.round(e.scroll)}%` : "—"}</span>,
            ];
          }}
        />
      </Panel>

      <Panel
        title="Blog"
        hint="Cât se citește efectiv din fiecare articol."
        result={a.blog}
      >
        <DataTable
          headers={["Articol", "Citiri", "Timp mediu", "Cât citesc"]}
          rows={a.blog.rows}
          render={(r) => [
            <span key="p" className="font-mono text-xs">{str(r[0]).replace("/blog/", "")}</span>,
            <span key="c" className="font-mono text-xs tabular-nums">{formatNumber(num(r[1]))}</span>,
            <span key="t" className="font-mono text-xs tabular-nums">{formatDuration(num(r[2]))}</span>,
            <span key="s" className="font-mono text-xs tabular-nums text-muted-foreground">{Math.round(num(r[3]))}%</span>,
          ]}
        />
      </Panel>

      {/* ---- Clicks ---- */}
      <Panel
        title="Unde apasă"
        hint="Fiecare click din site, cu textul elementului și pagina."
        result={a.clicks}
      >
        <DataTable
          headers={["Element", "Pagină", "Click-uri"]}
          rows={a.clicks.rows}
          render={(r) => [
            <span key="l" className="text-xs">{str(r[0])}</span>,
            <span key="p" className="font-mono text-xs text-muted-foreground">{str(r[1])}</span>,
            <span key="c" className="font-mono text-xs font-semibold tabular-nums">{formatNumber(num(r[2]))}</span>,
          ]}
        />
      </Panel>

      {/* ---- Where the money stalls ---- */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Unde lovesc paywall-ul"
          hint="Lecția pe care voiau s-o deschidă când au fost opriți."
          result={a.paywall}
        >
          <DataTable
            headers={["Curs", "Lecția", "Blocaje", "Oameni"]}
            rows={a.paywall.rows}
            render={(r) => [
              <span key="c" className="text-xs font-medium">{str(r[0])}</span>,
              <span key="l" className="font-mono text-xs tabular-nums">{num(r[1]) === 0 ? "teste" : num(r[1])}</span>,
              <span key="h" className="font-mono text-xs tabular-nums">{formatNumber(num(r[2]))}</span>,
              <span key="p" className="font-mono text-xs tabular-nums text-muted-foreground">{formatNumber(num(r[3]))}</span>,
            ]}
          />
        </Panel>

        <Panel
          title="Cât se învață"
          hint="Lecții deschise vs terminate, și scorul la teste."
          result={a.learning}
        >
          <DataTable
            headers={["Curs", "Deschise", "Terminate", "Teste", "Scor mediu"]}
            rows={a.learning.rows}
            render={(r) => [
              <span key="c" className="text-xs font-medium">{str(r[0])}</span>,
              <span key="o" className="font-mono text-xs tabular-nums">{formatNumber(num(r[1]))}</span>,
              <span key="d" className="font-mono text-xs tabular-nums">{formatNumber(num(r[2]))}</span>,
              <span key="q" className="font-mono text-xs tabular-nums">{formatNumber(num(r[3]))}</span>,
              <span key="s" className="font-mono text-xs tabular-nums">{num(r[4]) ? `${Math.round(num(r[4]))}%` : "—"}</span>,
            ]}
          />
        </Panel>
      </div>

      {/* ---- Person by person ---- */}
      <Panel
        title="Cine și-a făcut cont"
        hint="De unde a venit, de pe ce pagină a decis, și ce a făcut după."
        result={a.people}
      >
        <DataTable
          headers={["Cont creat", "Sursă", "A intrat pe", "A decis pe", "Pagini", "Lecții", "Blocat", "Plată"]}
          rows={a.people.rows}
          render={(r) => [
            <span key="t" className="whitespace-nowrap font-mono text-xs tabular-nums">
              {str(r[1]) === "—" ? "—" : new Date(str(r[1])).toLocaleDateString("ro-MD", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>,
            <span key="s" className="text-xs">{str(r[2]) === "—" ? "direct" : str(r[2])}</span>,
            <span key="l" className="font-mono text-xs text-muted-foreground">{str(r[3])}</span>,
            <span key="d" className="font-mono text-xs text-muted-foreground">{str(r[4])}</span>,
            <span key="p" className="font-mono text-xs tabular-nums">{num(r[5])}</span>,
            <span key="le" className="font-mono text-xs tabular-nums">{num(r[6])}</span>,
            <span key="b" className="font-mono text-xs tabular-nums text-warning">{num(r[7])}</span>,
            num(r[9]) > 0 ? (
              <span key="pay" className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success">plătit</span>
            ) : num(r[8]) > 0 ? (
              <span key="pay" className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase text-warning">abandonat</span>
            ) : (
              <span key="pay" className="text-xs text-muted-foreground">—</span>
            ),
          ]}
        />
      </Panel>

      {/* ---- Audience ---- */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Țări" result={a.countries}>
          <RankList rows={a.countries.rows} valueIndex={1} />
        </Panel>
        <Panel title="Dispozitive" result={a.devices}>
          <RankList rows={a.devices.rows} valueIndex={1} />
        </Panel>
        <Panel title="Browsere" result={a.browsers}>
          <RankList rows={a.browsers.rows} valueIndex={1} />
        </Panel>
      </div>

      {/* ---- Live feed ---- */}
      <Panel
        title="Activitate recentă"
        hint="Ultimele evenimente din site, în ordine."
        result={a.recent}
      >
        <ol className="space-y-1">
          {a.recent.rows.map((r, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 border-b border-border/40 py-1.5 last:border-b-0"
            >
              <span className="w-24 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {new Date(str(r[0])).toLocaleString("ro-MD", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className={cn("font-mono text-xs", str(r[1]).startsWith("$") ? "text-muted-foreground" : "font-semibold text-foreground")}>
                {str(r[1])}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                {str(r[2])}
              </span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <KeyRound className="size-5" />
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight">
        Mai lipsește o cheie
      </h1>
      <p className="mt-2 text-pretty text-sm text-muted-foreground">
        Datele se citesc din PostHog cu o <strong>Personal API key</strong>, alta
        decât cheia de scriere din site. O creezi în PostHog la{" "}
        <span className="font-mono text-xs">Settings → Personal API keys</span>,
        cu permisiunea <span className="font-mono text-xs">Query:Read</span>, și
        o pui în variabila de mediu{" "}
        <span className="font-mono text-xs">POSTHOG_PERSONAL_API_KEY</span>.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Cheia asta citește tot proiectul, deci rămâne doar pe server — nu ajunge
        niciodată în browser.
      </p>
    </div>
  );
}

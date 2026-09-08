import "server-only";
import { hogqlAll, scalar, type QueryResult } from "@/lib/analytics/posthog-api";
import { siteConfig } from "@/lib/site";

/**
 * Everything the admin analytics page shows, in one round of parallel queries.
 *
 * Read from PostHog rather than our own tables on purpose: behaviour lives
 * there — pageviews, referrers, clicks, scroll depth, session length — and
 * duplicating that pipeline into Postgres would mean maintaining two of them.
 * The personal API key never leaves the server; only these aggregates do.
 */

/** Only these windows are accepted — the value is interpolated into HogQL. */
export const PERIODS = [7, 30, 90] as const;
export type Period = (typeof PERIODS)[number];

export function parsePeriod(raw: string | undefined): Period {
  const n = Number(raw);
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 30;
}

export interface AnalyticsData {
  configured: boolean;
  /** First error encountered, if the whole thing failed (bad key, no project). */
  fatalError?: string;
  kpis: {
    visitors: number;
    sessions: number;
    pageviews: number;
    avgSessionSeconds: number;
    signups: number;
    paywallHits: number;
    checkoutsStarted: number;
    payments: number;
  };
  daily: QueryResult;
  referrers: QueryResult;
  entryPages: QueryResult;
  topPages: QueryResult;
  pageEngagement: QueryResult;
  blog: QueryResult;
  clicks: QueryResult;
  paywall: QueryResult;
  learning: QueryResult;
  people: QueryResult;
  countries: QueryResult;
  devices: QueryResult;
  browsers: QueryResult;
  recent: QueryResult;
  funnel: QueryResult;
}

export async function getAnalytics(days: Period): Promise<AnalyticsData> {
  const since = `now() - INTERVAL ${days} DAY`;

  // A visit that refers from our own domain is internal navigation, not a
  // traffic source. Folded into "direct", the way every analytics tool does it.
  const host = (() => {
    try {
      return new URL(siteConfig.url).hostname.replace(/^www\./, "");
    } catch {
      return "infobac.md";
    }
  })();
  const ownDomains = `('$direct', '', 'direct', '${host}', 'www.${host}')`;

  const q = await hogqlAll({
    kpis: `
      SELECT
        count(DISTINCT person_id) AS visitors,
        count(DISTINCT properties.$session_id) AS sessions,
        countIf(event = '$pageview') AS pageviews
      FROM events
      WHERE timestamp >= ${since}`,

    conversions: `
      SELECT
        countIf(event = 'signup_completed') AS signups,
        countIf(event = 'paywall_hit') AS paywalls,
        countIf(event = 'checkout_started') AS checkouts,
        countIf(event = 'checkout_completed') AS payments
      FROM events
      WHERE timestamp >= ${since}`,

    sessionLength: `
      SELECT round(avg(seconds)) FROM (
        SELECT dateDiff('second', min(timestamp), max(timestamp)) AS seconds
        FROM events
        WHERE timestamp >= ${since} AND properties.$session_id IS NOT NULL
        GROUP BY properties.$session_id
      )`,

    daily: `
      SELECT
        toDate(timestamp) AS day,
        count(DISTINCT person_id) AS visitors,
        countIf(event = '$pageview') AS pageviews,
        countIf(event = 'signup_completed') AS signups,
        countIf(event = 'checkout_completed') AS payments
      FROM events
      WHERE timestamp >= ${since}
      GROUP BY day ORDER BY day`,

    // Where they came from.
    referrers: `
      SELECT source, count() AS sessions, count(DISTINCT person) AS people FROM (
        SELECT
          properties.$session_id AS sid,
          any(person_id) AS person,
          -- The referrer of the FIRST pageview of the visit. Reading it off
          -- every pageview makes the site its own top traffic source, because
          -- each internal navigation refers from the previous page.
          argMin(
            multiIf(
              properties.$referring_domain IN ${ownDomains}, 'direct',
              properties.$referring_domain IS NULL, 'direct',
              properties.$referring_domain
            ),
            timestamp
          ) AS source
        FROM events
        WHERE event = '$pageview' AND timestamp >= ${since}
          AND properties.$session_id IS NOT NULL
        GROUP BY sid
      )
      GROUP BY source ORDER BY sessions DESC LIMIT 20`,

    // The page each visit started on.
    entryPages: `
      SELECT entry, count() AS sessions FROM (
        SELECT argMin(properties.$pathname, timestamp) AS entry
        FROM events
        WHERE event = '$pageview' AND timestamp >= ${since}
          AND properties.$session_id IS NOT NULL
        GROUP BY properties.$session_id
      )
      GROUP BY entry ORDER BY sessions DESC LIMIT 20`,

    topPages: `
      SELECT
        properties.$pathname AS path,
        count() AS views,
        count(DISTINCT person_id) AS visitors
      FROM events
      WHERE event = '$pageview' AND timestamp >= ${since}
      GROUP BY path ORDER BY views DESC LIMIT 30`,

    // Time on page and how far down people read. PostHog reports both on the
    // event *after* the pageview, tagged with the path they belong to.
    pageEngagement: `
      SELECT
        properties.$prev_pageview_pathname AS path,
        round(avg(toFloat(properties.$prev_pageview_duration))) AS avg_seconds,
        round(avg(toFloat(properties.$prev_pageview_max_scroll_percentage)) * 100) AS avg_scroll
      FROM events
      WHERE timestamp >= ${since} AND properties.$prev_pageview_pathname IS NOT NULL
      GROUP BY path ORDER BY avg_seconds DESC LIMIT 40`,

    blog: `
      SELECT
        properties.$prev_pageview_pathname AS path,
        count() AS reads,
        round(avg(toFloat(properties.$prev_pageview_duration))) AS avg_seconds,
        round(avg(toFloat(properties.$prev_pageview_max_scroll_percentage)) * 100) AS avg_scroll
      FROM events
      WHERE timestamp >= ${since}
        AND properties.$prev_pageview_pathname LIKE '/blog/%'
      GROUP BY path ORDER BY reads DESC LIMIT 30`,

    // What they actually pressed.
    clicks: `
      SELECT
        trim(coalesce(nullIf(properties.$el_text, ''), 'fără text')) AS label,
        properties.$pathname AS path,
        count() AS clicks
      FROM events
      WHERE event = '$autocapture' AND timestamp >= ${since}
      GROUP BY label, path ORDER BY clicks DESC LIMIT 30`,

    paywall: `
      SELECT
        properties.course AS course,
        toInt(properties.lesson_order) AS lesson,
        count() AS hits,
        count(DISTINCT person_id) AS people
      FROM events
      WHERE event = 'paywall_hit' AND timestamp >= ${since}
      GROUP BY course, lesson ORDER BY hits DESC LIMIT 25`,

    learning: `
      SELECT
        properties.course AS course,
        countIf(event = 'lesson_opened') AS opened,
        countIf(event = 'lesson_completed') AS completed,
        countIf(event = 'quiz_finished') AS quizzes,
        round(avgIf(toFloat(properties.score_percent), event = 'quiz_finished')) AS avg_score
      FROM events
      WHERE timestamp >= ${since}
        AND event IN ('lesson_opened', 'lesson_completed', 'quiz_finished')
      GROUP BY course ORDER BY opened DESC LIMIT 20`,

    // One row per person who signed up, with where they came from and how far
    // they got. This is the "de ce și-a făcut cont, ce a făcut după" table.
    people: `
      SELECT
        person_id,
        min(if(event = 'signup_completed', timestamp, NULL)) AS signed_up,
        argMax(person.properties.$initial_referring_domain, timestamp) AS source,
        argMax(person.properties.$initial_pathname, timestamp) AS landing,
        argMax(if(event = 'signup_cta_clicked', properties.from_path, NULL), timestamp) AS decided_on,
        countIf(event = '$pageview') AS pageviews,
        countIf(event = 'lesson_opened') AS lessons,
        countIf(event = 'paywall_hit') AS paywalls,
        countIf(event = 'checkout_started') AS checkouts,
        countIf(event = 'checkout_completed') AS payments
      FROM events
      WHERE timestamp >= ${since}
      GROUP BY person_id
      HAVING signed_up IS NOT NULL
      ORDER BY signed_up DESC LIMIT 50`,

    countries: `
      SELECT coalesce(properties.$geoip_country_name, 'necunoscut') AS country,
             count(DISTINCT person_id) AS people
      FROM events WHERE timestamp >= ${since}
      GROUP BY country ORDER BY people DESC LIMIT 15`,

    devices: `
      SELECT coalesce(properties.$device_type, 'necunoscut') AS device,
             count(DISTINCT person_id) AS people
      FROM events WHERE timestamp >= ${since}
      GROUP BY device ORDER BY people DESC LIMIT 10`,

    browsers: `
      SELECT coalesce(properties.$browser, 'necunoscut') AS browser,
             count(DISTINCT person_id) AS people
      FROM events WHERE timestamp >= ${since}
      GROUP BY browser ORDER BY people DESC LIMIT 10`,

    recent: `
      SELECT timestamp, event,
             coalesce(properties.$pathname, '') AS path,
             person_id
      FROM events
      WHERE timestamp >= now() - INTERVAL 2 DAY
      ORDER BY timestamp DESC LIMIT 60`,

    // People reaching each step, not raw event counts — a student who hits the
    // paywall six times is one person stuck, not six.
    funnel: `
      SELECT
        count(DISTINCT if(event = '$pageview', person_id, NULL)) AS visited,
        count(DISTINCT if(event = 'signup_cta_clicked', person_id, NULL)) AS cta,
        count(DISTINCT if(event = 'signup_completed', person_id, NULL)) AS signed_up,
        count(DISTINCT if(event = 'lesson_opened', person_id, NULL)) AS studied,
        count(DISTINCT if(event = 'paywall_hit', person_id, NULL)) AS blocked,
        count(DISTINCT if(event = 'plan_cta_clicked', person_id, NULL)) AS looked_at_plans,
        count(DISTINCT if(event = 'checkout_started', person_id, NULL)) AS started_checkout,
        count(DISTINCT if(event = 'checkout_completed', person_id, NULL)) AS paid
      FROM events
      WHERE timestamp >= ${since}`,
  });

  const kpiRow = q.kpis.rows[0] ?? [];
  const convRow = q.conversions.rows[0] ?? [];
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v ?? 0) || 0);

  return {
    configured: !q.kpis.error?.includes("nu e configurat"),
    fatalError: q.kpis.error,
    kpis: {
      visitors: num(kpiRow[0]),
      sessions: num(kpiRow[1]),
      pageviews: num(kpiRow[2]),
      avgSessionSeconds: scalar(q.sessionLength),
      signups: num(convRow[0]),
      paywallHits: num(convRow[1]),
      checkoutsStarted: num(convRow[2]),
      payments: num(convRow[3]),
    },
    daily: q.daily,
    referrers: q.referrers,
    entryPages: q.entryPages,
    topPages: q.topPages,
    pageEngagement: q.pageEngagement,
    blog: q.blog,
    clicks: q.clicks,
    paywall: q.paywall,
    learning: q.learning,
    people: q.people,
    countries: q.countries,
    devices: q.devices,
    browsers: q.browsers,
    recent: q.recent,
    funnel: q.funnel,
  };
}

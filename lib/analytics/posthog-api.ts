import "server-only";

/**
 * Read side of PostHog: runs HogQL against the project and hands back rows.
 *
 * Everything here is server-only. The personal API key can read the whole
 * project, so it must never reach the browser — the admin pages fetch through
 * this module and ship only the aggregated numbers.
 */
const HOST = "https://eu.posthog.com";
const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const configuredProjectId = process.env.POSTHOG_PROJECT_ID;

export const isAnalyticsApiConfigured = Boolean(apiKey);

/** Resolved once per server process — the project id rarely changes. */
let cachedProjectId: string | null = configuredProjectId ?? null;

async function resolveProjectId(): Promise<string | null> {
  if (cachedProjectId) return cachedProjectId;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${HOST}/api/projects/`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: Array<{ id: number }> };
    const id = data.results?.[0]?.id;
    if (id === undefined) return null;
    cachedProjectId = String(id);
    return cachedProjectId;
  } catch {
    return null;
  }
}

export type Row = Array<string | number | null>;

export interface QueryResult {
  rows: Row[];
  /** Set when the query could not run. The panel renders the reason instead of numbers. */
  error?: string;
}

/**
 * Runs one HogQL query.
 *
 * Results are cached for five minutes: these dashboards are read constantly
 * while a person clicks around, the numbers do not move meaningfully inside
 * that window, and PostHog rate-limits the query endpoint.
 */
export async function hogql(
  query: string,
  { revalidate = 300 }: { revalidate?: number } = {},
): Promise<QueryResult> {
  if (!apiKey) {
    return { rows: [], error: "POSTHOG_PERSONAL_API_KEY nu e configurat." };
  }

  const projectId = await resolveProjectId();
  if (!projectId) {
    return { rows: [], error: "Nu am putut identifica proiectul PostHog." };
  }

  try {
    const res = await fetch(`${HOST}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
      next: { revalidate },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[analytics] query failed:", res.status, body.slice(0, 300));
      return {
        rows: [],
        error:
          res.status === 401 || res.status === 403
            ? "Cheia PostHog nu are acces la proiect."
            : `PostHog a răspuns ${res.status}.`,
      };
    }

    const data = (await res.json()) as { results?: Row[] };
    return { rows: data.results ?? [] };
  } catch (err) {
    console.warn("[analytics] query threw:", err);
    return { rows: [], error: "Nu am putut contacta PostHog." };
  }
}

/** Runs several queries at once — a dashboard of a dozen panels must not be a dozen round trips in series. */
export async function hogqlAll<T extends Record<string, string>>(
  queries: T,
  options?: { revalidate?: number },
): Promise<Record<keyof T, QueryResult>> {
  const entries = Object.entries(queries);
  const results = await Promise.all(
    entries.map(([, q]) => hogql(q, options)),
  );
  return Object.fromEntries(
    entries.map(([key], i) => [key, results[i]]),
  ) as Record<keyof T, QueryResult>;
}

/** First cell of the first row as a number — the shape every KPI query returns. */
export function scalar(result: QueryResult): number {
  const v = result.rows[0]?.[0];
  return typeof v === "number" ? v : Number(v ?? 0) || 0;
}

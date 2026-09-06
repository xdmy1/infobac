import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { PlanId } from "@/lib/content";
import type {
  CheckoutSession,
  CreateCheckoutInput,
  GatewayEvent,
  PaymentGateway,
  ProviderSubscription,
  WebhookResult,
} from "./types";

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

const apiKey = process.env.CREEM_API_KEY;
const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

/**
 * Test mode is the default everywhere except production, so a misconfigured
 * preview deploy charges nobody. Set CREEM_TEST_MODE=0 to force live.
 */
const testMode =
  process.env.CREEM_TEST_MODE === "1"
    ? true
    : process.env.CREEM_TEST_MODE === "0"
      ? false
      : process.env.NODE_ENV !== "production";

const API_BASE = testMode
  ? "https://test-api.creem.io/v1"
  : "https://api.creem.io/v1";

/**
 * Creem products are created in their dashboard and priced in EUR — they are
 * the merchant of record, so they cannot charge MDL. One product per plan.
 */
const PRODUCT_BY_PLAN: Record<PlanId, string | undefined> = {
  module: process.env.CREEM_PRODUCT_MODULE,
  all: process.env.CREEM_PRODUCT_ALL,
  semester: process.env.CREEM_PRODUCT_SEMESTER,
};

// -----------------------------------------------------------------------------
// Wire types — only the fields we actually read.
// -----------------------------------------------------------------------------

interface CreemCheckoutResponse {
  id: string;
  checkout_url: string;
}

interface CreemWebhookEnvelope {
  id?: unknown;
  eventType?: unknown;
  object?: unknown;
}

// -----------------------------------------------------------------------------
// Gateway
// -----------------------------------------------------------------------------

export const creemGateway: PaymentGateway = {
  id: "creem",

  isConfigured: Boolean(
    apiKey &&
      webhookSecret &&
      PRODUCT_BY_PLAN.module &&
      PRODUCT_BY_PLAN.all &&
      PRODUCT_BY_PLAN.semester,
  ),

  isTestMode: testMode,

  productIdForPlan(plan: PlanId) {
    return PRODUCT_BY_PLAN[plan];
  },

  async createBillingPortal(customerId: string): Promise<string> {
    if (!apiKey) throw new Error("CREEM_API_KEY is not set.");

    const response = await fetch(`${API_BASE}/customers/billing`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Creem billing portal failed (${response.status}): ${body.slice(0, 300)}`,
      );
    }

    const data = (await response.json()) as { customer_portal_link?: string; url?: string };
    const link = data.customer_portal_link ?? data.url;
    if (!link) throw new Error("Creem billing portal response had no link.");
    return link;
  },

  async findCustomerIdByEmail(email: string): Promise<string | null> {
    if (!apiKey) throw new Error("CREEM_API_KEY is not set.");

    const url = new URL(`${API_BASE}/customers`);
    url.searchParams.set("email", email);
    const response = await fetch(url, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
    });

    // 404 = this email was never a paying customer. Not an error, just no id.
    if (response.status === 404) return null;
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Creem customer lookup failed (${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as { id?: string };
    return data?.id ?? null;
  },

  async listActiveSubscriptions(
    customerId: string,
  ): Promise<ProviderSubscription[]> {
    if (!apiKey) throw new Error("CREEM_API_KEY is not set.");

    const response = await fetch(
      `${API_BASE}/customers/${encodeURIComponent(customerId)}/subscriptions`,
      { headers: { "x-api-key": apiKey }, cache: "no-store" },
    );
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Creem subscriptions list failed (${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as { items?: unknown };
    const items = Array.isArray(data.items) ? data.items : [];
    return items
      .filter(isRecord)
      .map((s) => ({
        id: asString(s.id) ?? "",
        status: asString(s.status) ?? "unknown",
        currentPeriodEnd: asString(s.current_period_end_date),
      }))
      .filter(
        (s) =>
          s.id !== "" &&
          s.status !== "canceled" &&
          s.status !== "expired",
      );
  },

  async cancelSubscription(
    subscriptionId: string,
    mode: "scheduled" | "immediate",
  ): Promise<void> {
    if (!apiKey) throw new Error("CREEM_API_KEY is not set.");

    const response = await fetch(
      `${API_BASE}/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
      {
        method: "POST",
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Creem cancel failed (${response.status}): ${body.slice(0, 200)}`,
      );
    }
  },

  async createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession> {
    if (!apiKey) {
      throw new Error("CREEM_API_KEY is not set.");
    }
    const productId = PRODUCT_BY_PLAN[input.plan];
    if (!productId) {
      throw new Error(`No Creem product configured for plan "${input.plan}".`);
    }

    const response = await fetch(`${API_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        request_id: input.requestId,
        success_url: input.successUrl,
        metadata: input.metadata,
        ...(input.customerEmail
          ? { customer: { email: input.customerEmail } }
          : {}),
      }),
      // Never cached — every call must mint a fresh session.
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Creem checkout failed (${response.status}): ${body.slice(0, 300)}`,
      );
    }

    const data = (await response.json()) as CreemCheckoutResponse;
    if (!data?.id || !data?.checkout_url) {
      throw new Error("Creem checkout response missing id or checkout_url.");
    }

    return { id: data.id, url: data.checkout_url };
  },

  parseWebhook(rawBody: string, signature: string | null): WebhookResult {
    if (!webhookSecret || !signature) return { status: "invalid" };
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return { status: "invalid" };
    }

    let envelope: CreemWebhookEnvelope;
    try {
      envelope = JSON.parse(rawBody) as CreemWebhookEnvelope;
    } catch {
      return { status: "invalid" };
    }

    const eventType =
      typeof envelope.eventType === "string" ? envelope.eventType : "";
    const eventId = typeof envelope.id === "string" ? envelope.id : "";
    const object = isRecord(envelope.object) ? envelope.object : {};

    switch (eventType) {
      case "checkout.completed":
        return { status: "ok", event: fromCheckout(eventId, object) };
      case "subscription.paid":
        return { status: "ok", event: fromSubscriptionPaid(eventId, object) };
      case "refund.created":
        return { status: "ok", event: fromRefund(eventId, object) };
      default:
        // Everything else is informational for us:
        //  - subscription.active     → the docs say grant on `paid`, not this
        //  - scheduled_cancel/past_due/unpaid/canceled/expired → access was
        //    only ever granted to the paid period end, so it lapses by itself
        //  - dispute.created         → handled by hand, not automatically
        return { status: "ignored", eventType: eventType || "unknown" };
    }
  },
};

// -----------------------------------------------------------------------------
// Payload mapping
// -----------------------------------------------------------------------------

function fromCheckout(
  eventId: string,
  object: Record<string, unknown>,
): GatewayEvent {
  const order = isRecord(object.order) ? object.order : {};
  const product = isRecord(object.product) ? object.product : {};
  const subscription = isRecord(object.subscription) ? object.subscription : {};
  const customer = isRecord(object.customer) ? object.customer : {};

  // checkout.completed carries no period dates, only the product's cadence.
  // That is enough for a correct first grant; the `subscription.paid` that
  // follows replaces it with the exact timestamp Creem billed.
  const subscriptionId = asString(subscription.id);
  const periodEnd = subscriptionId
    ? periodEndFromBillingPeriod(asString(product.billing_period))
    : null;

  return {
    id: eventId,
    type: "payment.completed",
    requestId: asString(object.request_id),
    sessionId: asString(object.id),
    orderId: asString(order.id),
    // `order.product` is the id; `product.id` is the same value expanded.
    productId: asString(order.product) ?? asString(product.id),
    subscriptionId,
    customerId: asString(customer.id) ?? asString(order.customer),
    periodEnd,
    amountCents: asNumber(order.amount),
    currency: asString(order.currency),
    metadata: asMetadata(object.metadata),
  };
}

function fromSubscriptionPaid(
  eventId: string,
  object: Record<string, unknown>,
): GatewayEvent {
  const product = isRecord(object.product) ? object.product : {};
  const customer = isRecord(object.customer) ? object.customer : {};

  return {
    id: eventId,
    type: "subscription.renewed",
    // Renewals have no checkout behind them — the subscription id is the link.
    requestId: null,
    sessionId: null,
    orderId: null,
    productId: asString(product.id),
    subscriptionId: asString(object.id),
    customerId: asString(customer.id),
    periodEnd: asString(object.current_period_end_date),
    amountCents: asNumber(product.price),
    currency: asString(product.currency),
    metadata: asMetadata(object.metadata),
  };
}

function fromRefund(
  eventId: string,
  object: Record<string, unknown>,
): GatewayEvent {
  const transaction = isRecord(object.transaction) ? object.transaction : {};
  const subscription = isRecord(object.subscription) ? object.subscription : {};

  return {
    id: eventId,
    type: "payment.refunded",
    // Refunds carry no request_id — the order id is how we find our row.
    requestId: null,
    sessionId: null,
    orderId: asString(transaction.order),
    productId: null,
    subscriptionId: asString(subscription.id) ?? asString(transaction.subscription),
    customerId: null,
    periodEnd: null,
    amountCents: asNumber(object.refund_amount),
    currency: asString(object.refund_currency),
    metadata: {},
  };
}

/**
 * Maps Creem's `billing_period` to a concrete expiry for the FIRST grant only —
 * `checkout.completed` reports the cadence but no dates. The `subscription.paid`
 * that follows carries the exact `current_period_end_date` and replaces this.
 *
 * Values are Creem's own enum (ProductBillingPeriod in their SDK): they spell
 * the number out, so it is `every-six-months`, never `every-6-months`.
 *
 * Returns null for a non-recurring product, which tells the caller to fall back
 * to the plan's fixed period instead.
 */
function periodEndFromBillingPeriod(billingPeriod: string | null): string | null {
  const days: Record<string, number> = {
    "every-day": 1,
    "every-month": 30,
    "every-three-months": 91,
    "every-six-months": 182,
    "every-year": 365,
  };

  if (billingPeriod === "once") return null;

  const span = billingPeriod ? days[billingPeriod] : undefined;
  if (billingPeriod && span === undefined) {
    // Under-grant rather than give away an unpaid period; `subscription.paid`
    // corrects it seconds later anyway.
    console.warn(
      `[creem] unknown billing_period "${billingPeriod}" — granting 30 days`,
    );
  }

  return new Date(
    Date.now() + (span ?? 30) * 24 * 60 * 60 * 1000,
  ).toISOString();
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * HMAC-SHA256 of the raw body, hex-encoded, compared in constant time.
 *
 * The body must be the exact bytes Creem sent — re-serialising the parsed JSON
 * changes key order and whitespace and the digest stops matching.
 */
function verifySignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Keeps only string values — metadata is used to look up rows, not trusted. */
function asMetadata(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw === "string") out[key] = raw;
  }
  return out;
}

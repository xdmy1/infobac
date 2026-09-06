import "server-only";
import type { PlanId } from "@/lib/content";

/**
 * Provider-agnostic card-payment gateway.
 *
 * Creem is the merchant of record today because Moldova has no local acquiring
 * without an IDNO. When that changes, a `lib/payments/maib.ts` implementing
 * this same interface is the only new file needed — the Server Action, the
 * webhook route and the UI stay as they are.
 */
export interface PaymentGateway {
  readonly id: "creem";
  /** False when the env vars are missing — the UI hides the card option. */
  readonly isConfigured: boolean;
  /** True while pointed at the provider's sandbox. Surfaced in the UI. */
  readonly isTestMode: boolean;

  createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession>;

  /**
   * Verifies the request signature, then normalises the payload. The three
   * outcomes are deliberately distinct: an invalid signature must answer 401,
   * while a verified-but-uninteresting event must answer 200 so the provider
   * stops retrying it.
   */
  parseWebhook(rawBody: string, signature: string | null): WebhookResult;

  /** The provider's product id backing a plan, or undefined if unmapped. */
  productIdForPlan(plan: PlanId): string | undefined;

  /**
   * A self-service portal URL where the customer can cancel, change payment
   * method and download invoices. Creem requires that cancellation is
   * reachable from inside the product rather than by contacting support.
   */
  createBillingPortal(customerId: string): Promise<string>;
}

export interface CreateCheckoutInput {
  plan: PlanId;
  /** Our `payment_requests.id` — comes back on the event as `request_id`. */
  requestId: string;
  /** Pre-fills and locks the email so it matches the platform account. */
  customerEmail?: string;
  successUrl: string;
  metadata: Record<string, string>;
}

export interface CheckoutSession {
  /** Provider session id (`ch_…`), stored as `provider_session_id`. */
  id: string;
  /** Where to send the browser to pay. */
  url: string;
}

export type GatewayEventType =
  /** First payment of a checkout — links our row to the subscription. */
  | "payment.completed"
  /** A billing period was paid, including the first one. Authoritative. */
  | "subscription.renewed"
  /** Money returned — access is revoked early. */
  | "payment.refunded";

export interface GatewayEvent {
  /** Provider event id (`evt_…`). Doubles as the idempotency key. */
  id: string;
  type: GatewayEventType;
  /** Our `payment_requests.id`. Present on completion, absent on renewals. */
  requestId: string | null;
  sessionId: string | null;
  orderId: string | null;
  productId: string | null;
  /** Provider subscription id (`sub_…`) — how renewals find their row. */
  subscriptionId: string | null;
  /** Provider customer id (`cust_…`) — needed to open the billing portal. */
  customerId: string | null;
  /**
   * ISO timestamp the paid period ends. Access is granted exactly up to here,
   * so a subscription that stops renewing lapses on its own.
   */
  periodEnd: string | null;
  /** Minor units of `currency`, e.g. 1490 = €14.90. */
  amountCents: number | null;
  currency: string | null;
  /** What we attached at checkout: userId, plan, courseSlug. */
  metadata: Record<string, string>;
}

export type WebhookResult =
  /** Signature valid and the event is one we act on. */
  | { status: "ok"; event: GatewayEvent }
  /** Signature valid, event deliberately ignored (subscription noise, etc). */
  | { status: "ignored"; eventType: string }
  /** Signature missing, malformed, or not matching the body. */
  | { status: "invalid" };

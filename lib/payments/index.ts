import "server-only";
import { creemGateway } from "./creem";
import type { PaymentGateway } from "./types";

export type {
  CheckoutSession,
  CreateCheckoutInput,
  GatewayEvent,
  GatewayEventType,
  PaymentGateway,
  WebhookResult,
} from "./types";

/**
 * The active card gateway. Single-provider today; swapping to local acquiring
 * (MAIB / MICB / Paynet) once we have an IDNO means adding a module next to
 * `creem.ts` and changing this binding.
 */
export const gateway: PaymentGateway = creemGateway;

/** Whether to offer card payment at all. False → only the manual MIA flow. */
export const isCardCheckoutEnabled = gateway.isConfigured;

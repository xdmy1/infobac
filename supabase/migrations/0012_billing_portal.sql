-- =============================================================================
-- InfoBac.md — Creem customer id, for the self-service billing portal
--
-- Creem requires that customers can cancel a subscription from inside our
-- product, not by emailing us. Their customer portal does that (cancel,
-- payment method, invoices) but it is opened per customer id, so we have to
-- remember which Creem customer each of our users is.
-- =============================================================================

alter table public.payment_requests
  add column if not exists provider_customer_id text;

create index if not exists payment_requests_provider_customer_idx
  on public.payment_requests (user_id, provider_customer_id)
  where provider_customer_id is not null;

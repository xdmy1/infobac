-- =============================================================================
-- InfoBac.md — Card checkout via Creem (Merchant of Record)
--
-- The manual MIA flow from 0007 stays exactly as it is. This migration adds a
-- second rail on the SAME `payment_requests` table so /admin/plati, the
-- history on /abonament and the emails keep working unchanged:
--
--   provider = 'manual'  → student sends MIA, admin approves by hand
--   provider = 'creem'   → student pays by card, the webhook approves
--
-- Creem is the merchant of record: it charges the card in EUR, remits VAT and
-- pays out to us. Prices here stay in MDL for display/history — `amount_cents`
-- + `currency` record what was actually charged.
-- =============================================================================

-- ─── provider ───────────────────────────────────────────────────────────────
do $$ begin
  create type public.payment_provider as enum ('manual', 'creem');
exception when duplicate_object then null; end $$;

alter table public.payment_requests
  add column if not exists provider public.payment_provider not null
    default 'manual',
  -- Creem checkout session id (ch_…). Set when the session is created.
  add column if not exists provider_session_id text,
  -- Creem order id (ord_…). Set when the payment completes.
  add column if not exists provider_order_id text,
  -- Creem event id (evt_…) that approved this row — kept for audit + support.
  add column if not exists provider_event_id text,
  -- What the card was actually charged, in minor units (e.g. 1490 = €14.90).
  add column if not exists amount_cents integer,
  add column if not exists currency text;

-- One row per Creem checkout session — the webhook can be delivered up to
-- 5 times for the same event, so the lookup key must be unique.
create unique index if not exists payment_requests_provider_session_key
  on public.payment_requests (provider_session_id)
  where provider_session_id is not null;

-- Pending card checkouts that were abandoned are noise in /admin/plati.
-- This index lets the admin query filter them out cheaply.
create index if not exists payment_requests_provider_status_idx
  on public.payment_requests (provider, status, created_at desc);

-- ─── grant logic: one implementation, two callers ───────────────────────────
-- 0007 put the grant inside `admin_grant_subscription`, gated on is_admin().
-- The Creem webhook has no session at all (it runs as service_role), so the
-- body moves into an internal function and `admin_grant_subscription` becomes
-- a thin authorization wrapper over it. Behaviour is identical for admins.
create or replace function public.grant_subscription_internal(
  p_user_id uuid,
  p_plan public.subscription_plan,
  p_course_slug text
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_period interval;
  v_now timestamptz := now();
begin
  v_period := case p_plan
    when 'module'   then interval '30 days'
    when 'all'      then interval '30 days'
    when 'semester' then interval '180 days'
  end;

  insert into public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  ) values (
    p_user_id, p_plan, 'active', v_now, v_now + v_period
  )
  on conflict do nothing;

  if p_plan = 'module' then
    if p_course_slug is null then
      raise exception 'module_plan_requires_course_slug';
    end if;

    insert into public.course_access (
      user_id, course_id, granted_at, expires_at, source
    )
    select p_user_id, c.id, v_now, v_now + v_period, 'subscription'::public.access_source
      from public.courses c
     where c.slug = p_course_slug
    on conflict (user_id, course_id) do update set
      expires_at = excluded.expires_at,
      source = excluded.source,
      granted_at = excluded.granted_at;
  else
    insert into public.course_access (
      user_id, course_id, granted_at, expires_at, source
    )
    select p_user_id, c.id, v_now, v_now + v_period, 'subscription'::public.access_source
      from public.courses c
     where c.slug in ('python', 'sql', 'devices')
    on conflict (user_id, course_id) do update set
      expires_at = excluded.expires_at,
      source = excluded.source,
      granted_at = excluded.granted_at;
  end if;
end;
$$;

-- No caller-side authorization inside — so it must never be reachable from a
-- logged-in session. Only service_role (the webhook) and the admin wrapper.
revoke all on function public.grant_subscription_internal(
  uuid, public.subscription_plan, text
) from public, anon, authenticated;
grant execute on function public.grant_subscription_internal(
  uuid, public.subscription_plan, text
) to service_role;

create or replace function public.admin_grant_subscription(
  p_user_id uuid,
  p_plan public.subscription_plan,
  p_course_slug text
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'admin_only';
  end if;

  perform public.grant_subscription_internal(p_user_id, p_plan, p_course_slug);
end;
$$;

revoke all on function public.admin_grant_subscription(
  uuid, public.subscription_plan, text
) from public, anon;
grant execute on function public.admin_grant_subscription(
  uuid, public.subscription_plan, text
) to authenticated;

-- ─── revoking access on refund ──────────────────────────────────────────────
-- Creem sends `refund.created` when a payment is refunded. We expire the
-- grants rather than deleting them, so the audit trail survives.
create or replace function public.revoke_subscription_internal(
  p_user_id uuid,
  p_plan public.subscription_plan,
  p_course_slug text
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := now();
begin
  update public.subscriptions
     set status = 'canceled',
         current_period_end = least(current_period_end, v_now)
   where user_id = p_user_id
     and plan = p_plan;

  if p_plan = 'module' and p_course_slug is not null then
    update public.course_access ca
       set expires_at = v_now,
           note = coalesce(ca.note || ' · ', '') || 'refunded'
      from public.courses c
     where c.id = ca.course_id
       and ca.user_id = p_user_id
       and c.slug = p_course_slug
       and ca.source = 'subscription';
  else
    update public.course_access ca
       set expires_at = v_now,
           note = coalesce(ca.note || ' · ', '') || 'refunded'
     where ca.user_id = p_user_id
       and ca.source = 'subscription';
  end if;
end;
$$;

revoke all on function public.revoke_subscription_internal(
  uuid, public.subscription_plan, text
) from public, anon, authenticated;
grant execute on function public.revoke_subscription_internal(
  uuid, public.subscription_plan, text
) to service_role;

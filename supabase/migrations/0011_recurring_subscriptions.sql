-- =============================================================================
-- InfoBac.md — Recurring card subscriptions (Creem)
--
-- The Creem products are `recurring` / `every-month`: the card is charged again
-- each period and Creem emits `subscription.paid`. 0010 only handled the first
-- payment, so a renewal took the student's money without extending access.
--
-- The fix is to stop deriving the period from the plan and start using the
-- period Creem actually billed (`current_period_end_date`). Access then always
-- matches what was paid for, and it keeps matching if the billing period is
-- ever changed in the Creem dashboard — no code change needed.
--
-- Cancellation deliberately has no handler: access was granted only up to the
-- paid period end, so an unrenewed subscription lapses on its own. We never cut
-- access someone already paid for. Only a refund revokes early (see 0010).
-- =============================================================================

-- ─── link a row to its Creem subscription, and make events idempotent ───────
alter table public.payment_requests
  add column if not exists provider_subscription_id text,
  -- End of the period this row paid for, as billed by the provider.
  --
  -- Also the discriminator that stops the first payment being counted twice:
  -- `subscription.paid` fires moments after `checkout.completed` for the very
  -- same charge. A checkout row starts with period_end NULL, so the first
  -- `paid` fills it in place; only once it is set does a later `paid` mean a
  -- genuine renewal and get its own row.
  add column if not exists period_end timestamptz;

create index if not exists payment_requests_provider_subscription_idx
  on public.payment_requests (provider_subscription_id)
  where provider_subscription_id is not null;

-- Every provider event is applied at most once. Creem retries up to 5 times
-- over 24h and can replay from the dashboard, so a renewal that inserts a new
-- row needs a hard uniqueness guard rather than a status check.
create unique index if not exists payment_requests_provider_event_key
  on public.payment_requests (provider_event_id)
  where provider_event_id is not null;

-- ─── grant access up to an explicit timestamp ───────────────────────────────
-- Same shape as grant_subscription_internal, but the caller supplies the
-- expiry instead of it being inferred from the plan. Used for both the first
-- payment and every renewal.
create or replace function public.grant_subscription_until(
  p_user_id uuid,
  p_plan public.subscription_plan,
  p_course_slug text,
  p_expires_at timestamptz
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := now();
begin
  if p_expires_at is null then
    raise exception 'expires_at_required';
  end if;

  -- 0007 used `on conflict do nothing` here, which silently skipped the update
  -- on any repeat payment. A renewal must move the period forward.
  insert into public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  ) values (
    p_user_id, p_plan, 'active', v_now, p_expires_at
  )
  on conflict (user_id, plan) do update set
    status = 'active',
    current_period_start = least(
      public.subscriptions.current_period_start, v_now
    ),
    current_period_end = greatest(
      coalesce(public.subscriptions.current_period_end, p_expires_at),
      p_expires_at
    );

  if p_plan = 'module' then
    if p_course_slug is null then
      raise exception 'module_plan_requires_course_slug';
    end if;

    insert into public.course_access (
      user_id, course_id, granted_at, expires_at, source
    )
    select p_user_id, c.id, v_now, p_expires_at, 'subscription'::public.access_source
      from public.courses c
     where c.slug = p_course_slug
    on conflict (user_id, course_id) do update set
      -- Never shorten an existing grant — a manual gift or a longer plan wins.
      expires_at = greatest(
        coalesce(public.course_access.expires_at, p_expires_at),
        p_expires_at
      ),
      source = excluded.source;
  else
    insert into public.course_access (
      user_id, course_id, granted_at, expires_at, source
    )
    select p_user_id, c.id, v_now, p_expires_at, 'subscription'::public.access_source
      from public.courses c
     where c.slug in ('python', 'sql', 'devices')
    on conflict (user_id, course_id) do update set
      expires_at = greatest(
        coalesce(public.course_access.expires_at, p_expires_at),
        p_expires_at
      ),
      source = excluded.source;
  end if;
end;
$$;

revoke all on function public.grant_subscription_until(
  uuid, public.subscription_plan, text, timestamptz
) from public, anon, authenticated;
grant execute on function public.grant_subscription_until(
  uuid, public.subscription_plan, text, timestamptz
) to service_role;

-- =============================================================================
-- InfoBac.md — Make the self-service cancel actually stick
--
-- 0012 shipped one-click cancel: the Server Action cancels at Creem, then
-- writes `status = 'canceled'` back to `subscriptions` through the caller's
-- own client. There is no UPDATE policy on that table for `authenticated`
-- (0001, deliberately — billing state is written by the webhook, not by the
-- customer), so that write matched zero rows and returned no error. Creem had
-- the cancellation; our database never did. From the student's side:
--
--   * /abonament kept showing "Activ · următoarea reînnoire", so there was no
--     way to tell whether the cancel had worked;
--   * getPurchaseBlock still saw a live full plan and refused a re-subscribe;
--   * pressing cancel again found nothing active at Creem and errored out.
--
-- The table stays closed to `authenticated`. Instead it gets exactly one
-- door: a security-definer function that can only ever touch the caller's
-- own rows, and only the ones that are still live.
-- =============================================================================

-- `status` says what the row is now; this says when the student decided it,
-- and separates "cancelled on purpose" from "quietly lapsed".
alter table public.subscriptions
  add column if not exists canceled_at timestamptz;

-- ─── cancel, scoped to the caller ───────────────────────────────────────────
-- Cancels every live subscription belonging to auth.uid(), at period end.
--
-- `current_period_end` is deliberately left alone: that period is paid for and
-- the student keeps it. `course_access` is untouched for the same reason — it
-- lapses on its own (0011). Only a refund cuts access early (0010).
--
-- Returns the rows it changed, so the caller can name the exact end date and
-- can tell "nothing to cancel" apart from "cancelled".
-- The OUT parameters are deliberately not named `plan` / `current_period_end`:
-- in PL/pgSQL those names would become variables and collide with the columns
-- of the very table being updated.
create or replace function public.cancel_my_subscription()
returns table (
  canceled_plan public.subscription_plan,
  ends_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  return query
  with updated as (
    update public.subscriptions s
       set status = 'canceled',
           canceled_at = v_now
     where s.user_id = v_user_id
       and s.status in ('active', 'trialing')
       -- A row whose period is already over is history, not something to
       -- cancel; leaving it alone keeps "nothing to cancel" honest.
       and (s.current_period_end is null or s.current_period_end > v_now)
    returning s.plan, s.current_period_end
  )
  select u.plan, u.current_period_end from updated u;
end;
$$;

revoke all on function public.cancel_my_subscription() from public, anon;
grant execute on function public.cancel_my_subscription() to authenticated;

-- ─── re-subscribing clears the flag ─────────────────────────────────────────
-- Both grant paths upsert on (user_id, plan), so a student who cancels and
-- then buys the same plan again lands on the same row. Without clearing
-- `canceled_at` that row would come back active while still carrying the date
-- it was cancelled. Same body as 0011 / 0010 otherwise.
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

  insert into public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  ) values (
    p_user_id, p_plan, 'active', v_now, p_expires_at
  )
  on conflict (user_id, plan) do update set
    status = 'active',
    canceled_at = null,
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

-- The admin/manual path shares the same row, so it clears the flag too.
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

  -- 0010 used `on conflict do nothing`, which left a cancelled or lapsed row
  -- untouched — a manual re-grant then changed nothing at all.
  insert into public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  ) values (
    p_user_id, p_plan, 'active', v_now, v_now + v_period
  )
  on conflict (user_id, plan) do update set
    status = 'active',
    canceled_at = null,
    current_period_start = least(
      public.subscriptions.current_period_start, v_now
    ),
    current_period_end = greatest(
      coalesce(public.subscriptions.current_period_end, v_now + v_period),
      v_now + v_period
    );

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

revoke all on function public.grant_subscription_internal(
  uuid, public.subscription_plan, text
) from public, anon, authenticated;
grant execute on function public.grant_subscription_internal(
  uuid, public.subscription_plan, text
) to service_role;

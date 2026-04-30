-- =============================================================================
-- InfoBac.md — Manual MIA payment flow
--
-- Romania-MD bank rails: students pay by sending the plan amount to the
-- platform owner's MIA account (+373 68327082) and confirm via either:
--   1. uploading a screenshot to Supabase Storage, OR
--   2. ticking "trimis pe Telegram" — they DM the screenshot to the same
--      number on Telegram, no app upload needed.
--
-- Each request becomes a `payment_requests` row in 'pending' state.
-- An admin reviews, approves or rejects it from /admin/plati. On
-- approval, the server action grants `course_access` rows (1 course for
-- module plan, all 3 for all/semester) with the right expiry.
-- =============================================================================

-- ─── Make sure the course table has a row per static content slug ───────────
-- The static content under lib/content/courses uses 'devices'. Older seeds
-- shipped 'networking' instead. Insert 'devices' if missing.
insert into public.courses
  (slug, title, description, order_index, estimated_duration, difficulty, icon)
values
  ('devices', 'Devices',
   'Componente, sisteme de operare, conectori, troubleshooting.',
   3, '5–8 ore', 'easy', '/courses/networking-devices.png')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index,
  estimated_duration = excluded.estimated_duration,
  difficulty = excluded.difficulty,
  icon = excluded.icon;

-- ─── payment_requests ───────────────────────────────────────────────────────
do $$ begin
  create type public.payment_request_status as enum (
    'pending', 'approved', 'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_proof_via as enum (
    'upload', 'telegram', 'none'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.payment_requests (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  plan                public.subscription_plan not null,
  -- Only set when plan = 'module' (single-course purchase). NULL for the
  -- 'all' and 'semester' plans which grant access to every course.
  selected_course_slug text,
  amount_mdl          integer not null check (amount_mdl > 0),
  status              public.payment_request_status not null default 'pending',
  proof_via           public.payment_proof_via not null default 'none',
  -- Storage path under the `payment-proofs` bucket, e.g. "<user_id>/<id>.png".
  proof_path          text,
  user_notes          text,
  reviewed_at         timestamptz,
  reviewed_by         uuid references auth.users(id) on delete set null,
  reviewed_notes      text,
  created_at          timestamptz not null default now()
);

create index if not exists payment_requests_user_idx
  on public.payment_requests (user_id, created_at desc);

create index if not exists payment_requests_pending_idx
  on public.payment_requests (created_at desc)
  where status = 'pending';

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table public.payment_requests enable row level security;

-- Owner can SELECT their own (any status).
drop policy if exists "payment_requests_select_own" on public.payment_requests;
create policy "payment_requests_select_own" on public.payment_requests
  for select using (auth.uid() = user_id);

-- Owner can INSERT only as themself, only in pending state.
drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own" on public.payment_requests
  for insert with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_at is null
    and reviewed_by is null
  );

-- Admin can SELECT all + UPDATE for review.
drop policy if exists "payment_requests_select_admin" on public.payment_requests;
create policy "payment_requests_select_admin" on public.payment_requests
  for select using (public.is_admin());

drop policy if exists "payment_requests_update_admin" on public.payment_requests;
create policy "payment_requests_update_admin" on public.payment_requests
  for update using (public.is_admin())
  with check (public.is_admin());

-- ─── Storage bucket: payment-proofs ─────────────────────────────────────────
-- Private bucket — only owner + admins can read.
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- Owner can upload to their own folder (auth.uid()/<filename>).
drop policy if exists "payment_proofs_insert_own" on storage.objects;
create policy "payment_proofs_insert_own" on storage.objects
  for insert
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owner can read their own files.
drop policy if exists "payment_proofs_select_own" on storage.objects;
create policy "payment_proofs_select_own" on storage.objects
  for select
  using (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all proofs.
drop policy if exists "payment_proofs_select_admin" on storage.objects;
create policy "payment_proofs_select_admin" on storage.objects
  for select
  using (
    bucket_id = 'payment-proofs'
    and public.is_admin()
  );

-- ─── helpful: a function admins can call from the action layer to grant ─────
-- access for a subscription. Lives in SQL so the RLS bypass is well-scoped.
-- The action passes (user_id, plan, single_course_slug?) and we insert the
-- right course_access rows with expires_at = now() + 30/180 days.
create or replace function public.admin_grant_subscription(
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
  if not public.is_admin() then
    raise exception 'admin_only';
  end if;

  v_period := case p_plan
    when 'module'   then interval '30 days'
    when 'all'      then interval '30 days'
    when 'semester' then interval '180 days'
  end;

  -- Upsert the subscription row, status active, period = now → now + period.
  insert into public.subscriptions (
    user_id, plan, status, current_period_start, current_period_end
  ) values (
    p_user_id, p_plan, 'active', v_now, v_now + v_period
  )
  on conflict do nothing;

  -- Grant course_access. For 'module', single course slug; otherwise all 3.
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

revoke all on function public.admin_grant_subscription(uuid, public.subscription_plan, text) from public;
grant execute on function public.admin_grant_subscription(uuid, public.subscription_plan, text) to authenticated;

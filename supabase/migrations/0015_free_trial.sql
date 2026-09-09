-- =============================================================================
-- InfoBac.md — 7 zile gratis, fără card
--
-- The student picks one module, presses one button, and gets seven days of
-- everything inside it: lessons, quizzes, exam simulations. No card is asked
-- for at any point, so there is nothing to charge when the week is over — the
-- grant simply expires and `has_course_access` stops returning true.
--
-- Two rows do the work:
--
--   * `trials`   — one per person, forever. The primary key IS user_id, so
--                  "one trial per account" is a database guarantee and not
--                  something the app has to remember to check.
--   * `course_access` — the same table every paid grant writes to, with
--                  source 'trial' and a seven-day `expires_at`. Nothing else
--                  in the app needs to learn what a trial is: RLS on lessons,
--                  quizzes and questions already asks `has_course_access`.
--
-- `subscriptions` is untouched on purpose. That table is billing state, written
-- by the webhook and service_role only (0001, 0010). A trial involves no money,
-- no provider and no billing period, so it has no business there.
-- =============================================================================

-- ─── trials ─────────────────────────────────────────────────────────────────
create table if not exists public.trials (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  started_at  timestamptz not null default now(),
  ends_at     timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists trials_course_idx on public.trials (course_id);

alter table public.trials enable row level security;

-- Read your own row and nothing else. There is no insert/update/delete policy
-- at all: the only way in is the security-definer function below, which is
-- what keeps "one per person, only during the offer" enforceable.
drop policy if exists "trials_select_own" on public.trials;
create policy "trials_select_own"
  on public.trials for select
  using (user_id = auth.uid());

-- ─── the offer window ───────────────────────────────────────────────────────
-- Mirrored in lib/content.ts as `freeTrial.offerEndsAt` for the countdown and
-- for hiding the banner. THIS one decides — the TypeScript copy only decorates.
-- 15 September 2026 inclusive, Chișinău time, so the door closes at midnight
-- between the 15th and the 16th.
create or replace function public.trial_offer_ends_at()
returns timestamptz
language sql
immutable
as $$
  select timestamptz '2026-09-16 00:00:00+03';
$$;

-- ─── start_free_trial(course_slug) ──────────────────────────────────────────
-- Grants the caller seven days on one course. Every refusal is a distinct
-- exception so the Server Action can turn it into a sentence the student can
-- act on, rather than one generic "something went wrong".
create or replace function public.start_free_trial(p_course_slug text)
returns table (
  course_slug text,
  ends_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_now timestamptz := now();
  v_course_id uuid;
  v_ends timestamptz;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if v_now >= public.trial_offer_ends_at() then
    raise exception 'trial_offer_closed';
  end if;

  select c.id into v_course_id
    from public.courses c
   where c.slug = p_course_slug;

  if v_course_id is null then
    raise exception 'unknown_course';
  end if;

  -- One per account, forever — including a trial that has already run out.
  -- The week is the offer; a second week is a purchase.
  if exists (select 1 from public.trials t where t.user_id = v_user_id) then
    raise exception 'trial_already_used';
  end if;

  -- Someone holding live access has nothing to try out, and letting the grant
  -- through would quietly overwrite a paid row with a seven-day one.
  if exists (
    select 1
      from public.course_access ca
     where ca.user_id = v_user_id
       and (ca.expires_at is null or ca.expires_at > v_now)
  ) then
    raise exception 'already_has_access';
  end if;

  v_ends := v_now + interval '7 days';

  insert into public.trials (user_id, course_id, started_at, ends_at)
  values (v_user_id, v_course_id, v_now, v_ends);

  -- The conflict target is only reachable through an access row that has
  -- already lapsed; a live one was refused above.
  insert into public.course_access (
    user_id, course_id, granted_at, expires_at, source
  )
  values (
    v_user_id, v_course_id, v_now, v_ends, 'trial'::public.access_source
  )
  on conflict (user_id, course_id) do update set
    granted_at = v_now,
    expires_at = v_ends,
    source = 'trial'::public.access_source;

  return query select p_course_slug, v_ends;
end;
$$;

revoke all on function public.start_free_trial(text) from public, anon;
grant execute on function public.start_free_trial(text) to authenticated;

revoke all on function public.trial_offer_ends_at() from public;
grant execute on function public.trial_offer_ends_at() to anon, authenticated;

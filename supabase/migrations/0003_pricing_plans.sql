-- =============================================================================
-- InfoBac.md — Pricing model rewrite
--
-- Old plans (basic / standard / lifetime) replaced with:
--   - 'module'    : 250 MDL / lună, single course
--   - 'all'       : 550 MDL / lună, all 3 courses
--   - 'semester'  : 950 MDL / 6 months, all 3 courses
--
-- We replace the enum in-place by:
--   1. Renaming the old enum to *_old
--   2. Creating the new enum with new values
--   3. Casting existing rows through CASE mapping
--   4. Dropping the old enum
-- =============================================================================

alter type public.subscription_plan rename to subscription_plan_old;

create type public.subscription_plan as enum ('module', 'all', 'semester');

alter table public.subscriptions
  alter column plan drop default;

alter table public.subscriptions
  alter column plan type public.subscription_plan
  using (
    case plan::text
      when 'basic'    then 'module'::public.subscription_plan
      when 'standard' then 'all'::public.subscription_plan
      when 'lifetime' then 'semester'::public.subscription_plan
      else 'module'::public.subscription_plan
    end
  );

drop type public.subscription_plan_old;

-- Same UNIQUE constraint shape, but mention in case it needs replacement later:
-- subscriptions has UNIQUE (user_id, plan) — works for new enum without change.

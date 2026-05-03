-- =============================================================================
-- InfoBac.md — Minor consent flow
--
-- Audience is 16-19 year-olds, with majority minors under MD law (Codul civil
-- RM art. 21 — capacitate de exercițiu restrânsă pentru contracte oneroase).
-- We capture: (1) self-declared age bracket, (2) parental-consent confirmation,
-- (3) optional parent email for verification flows.
--
-- Notes
-- -----
-- This migration extends the column-level UPDATE grants from 0008. Re-running
-- `revoke update ... grant update (...)` is idempotent — Postgres simply
-- replaces the existing grant set.
-- =============================================================================

alter table public.profiles
  add column if not exists is_minor boolean,
  add column if not exists parental_consent_at timestamptz,
  add column if not exists parent_email text;

comment on column public.profiles.is_minor is
  'Self-declared at signup: true if user indicated they are under 18.';
comment on column public.profiles.parental_consent_at is
  'Timestamp captured when a minor confirmed parental/guardian consent. NULL for adults.';
comment on column public.profiles.parent_email is
  'Optional email of parent/guardian for notifications and (future) verification flows.';

-- -----------------------------------------------------------------------------
-- Re-issue column-level UPDATE grants. We extend 0008's allow-list with the
-- three new consent fields. `role` remains intentionally absent (the
-- `prevent_role_self_change` trigger from 0008 is the second line of defence).
-- -----------------------------------------------------------------------------
revoke update on public.profiles from authenticated;

grant update (
  full_name,
  avatar_url,
  school,
  grade,
  updated_at,
  is_minor,
  parental_consent_at,
  parent_email
) on public.profiles to authenticated;

grant update on public.profiles to service_role;

-- =============================================================================
-- InfoBac.md — 'trial' as a source of course access
--
-- Deliberately alone in its own migration. `alter type ... add value` and any
-- statement that USES the new value cannot share a transaction: the value is
-- not visible to the same transaction that added it, and `check_function_bodies`
-- resolves enum literals while a plpgsql function is being created. Splitting
-- the enum change out is the standard way around that — 0015 carries the table,
-- the function and everything that reads 'trial'.
-- =============================================================================

alter type public.access_source add value if not exists 'trial';

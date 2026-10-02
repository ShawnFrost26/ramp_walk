-- ==============================================================================
-- Dharti Aaba Veer Birsa Munda Jayanti 2026 — Ramp Walk Registration Web App
-- Migration 004: Standardize Delegate Age Limit to 15 – 35 Years
-- Replaces legacy age groups (Junior, Youth, Open) with mandatory 15 – 35 Years criteria
-- ==============================================================================

-- 1. Update all existing registrations to standardize age_category to '15 – 35 Years'
update public.registrations
set
  age_category = '15 – 35 Years',
  updated_at = now()
where age_category is null or age_category != '15 – 35 Years';

-- 2. Alter column default for future registrations
alter table public.registrations
  alter column age_category set default '15 – 35 Years';

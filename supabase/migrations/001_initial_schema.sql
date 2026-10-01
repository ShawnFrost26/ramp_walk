-- ==============================================================================
-- Dharti Aaba Veer Birsa Munda Jayanti 2026 — Ramp Walk Registration Web App
-- Migration 001: Initial Database Schema, Sequences, Triggers & RLS Policies
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. EVENT SETTINGS
-- ------------------------------------------------------------------------------
create table if not exists public.event_settings (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_short_name text not null,
  event_year integer not null default 2026,
  registration_fee integer not null default 500,
  currency text not null default 'INR',
  registration_open_at timestamptz,
  registration_close_at timestamptz,
  support_phone text,
  support_email text,
  terms_version text default 'v1.0',
  privacy_policy_version text default 'v1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed default event configuration if empty
insert into public.event_settings (
  event_name,
  event_short_name,
  event_year,
  registration_fee,
  currency,
  support_phone,
  support_email,
  terms_version,
  privacy_policy_version
)
select
  'Dharti Aaba Veer Birsa Munda Jayanti 2026 - Ramp Walk Competition',
  'Birsa Jayanti Ramp Walk 2026',
  2026,
  500,
  'INR',
  '+91 94370 00000',
  'support@birsa-jayanti2026.org',
  'v1.0',
  'v1.0'
where not exists (select 1 from public.event_settings);

-- ------------------------------------------------------------------------------
-- 2. REGISTRATION NUMBER SEQUENCE
-- ------------------------------------------------------------------------------
create sequence if not exists public.registration_number_seq start 1001;

create or replace function public.generate_registration_number()
returns text as $$
begin
  return 'TH26-' || lpad(nextval('public.registration_number_seq')::text, 6, '0');
end;
$$ language plpgsql;

-- ------------------------------------------------------------------------------
-- 3. REGISTRATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_number text unique,

  -- Section I: Participant Bio-Data & Identification
  full_name text not null,
  guardian_name text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('MALE', 'FEMALE', 'OTHER')),
  tribal_community text,

  identity_proof_type text,
  identity_proof_number text,
  identity_proof_storage_path text,

  state text not null,
  district text not null,
  city_or_village text not null,
  full_address text not null,
  pincode text not null,

  mobile_number text not null unique,
  whatsapp_number text,
  email text not null unique,

  educational_qualification text,
  occupation text,
  instagram_handle text,

  -- Section II: Competition Details
  category text not null,
  age_category text,

  attire_name text,
  attire_representation text,
  attire_description text,
  special_talent text,

  -- Section III: Photo & Status
  photo_storage_path text,
  registration_status text not null default 'DRAFT' check (registration_status in ('DRAFT', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED')),

  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz
);

-- ------------------------------------------------------------------------------
-- 4. PAYMENTS / PAYMENT ATTEMPTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,

  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,

  amount integer not null default 50000, -- Amount in paise (₹500.00 = 50000)
  currency text not null default 'INR',

  status text not null default 'CREATED' check (status in ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED')),
  signature_verified boolean not null default false,

  failure_code text,
  failure_reason text,

  provider_created_at timestamptz,
  captured_at timestamptz,
  raw_provider_metadata jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backward compatibility alias view for 'payments'
create or replace view public.payments as select * from public.payment_attempts;

-- ------------------------------------------------------------------------------
-- 5. DELEGATES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.delegates (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references public.registrations(id) on delete cascade,
  auth_user_id uuid unique,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. WEBHOOK EVENTS TABLE (IDEMPOTENCY & AUDIT)
-- ------------------------------------------------------------------------------
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text not null unique,
  event_type text not null,
  signature_valid boolean not null default false,
  payload jsonb,
  processing_status text not null default 'RECEIVED' check (processing_status in ('RECEIVED', 'PROCESSED', 'FAILED', 'DUPLICATE')),
  error_message text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

-- ------------------------------------------------------------------------------
-- 7. GOOGLE SHEETS SYNC JOBS
-- ------------------------------------------------------------------------------
create table if not exists public.sheet_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  synced_at timestamptz
);

-- ------------------------------------------------------------------------------
-- 8. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.registrations(id) on delete set null,
  action text not null,
  actor_type text not null check (actor_type in ('SYSTEM', 'PARTICIPANT', 'ADMIN', 'WEBHOOK')),
  actor_identifier text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
create index if not exists idx_registrations_number on public.registrations(registration_number);
create index if not exists idx_registrations_mobile on public.registrations(mobile_number);
create index if not exists idx_registrations_email on public.registrations(email);
create index if not exists idx_registrations_status on public.registrations(registration_status);
create index if not exists idx_registrations_category on public.registrations(category);
create index if not exists idx_registrations_created_at on public.registrations(created_at desc);

create index if not exists idx_payment_attempts_reg_id on public.payment_attempts(registration_id);
create index if not exists idx_payment_attempts_order on public.payment_attempts(razorpay_order_id);
create index if not exists idx_payment_attempts_payment on public.payment_attempts(razorpay_payment_id);
create index if not exists idx_payment_attempts_status on public.payment_attempts(status);

create index if not exists idx_webhook_events_id on public.webhook_events(provider, event_id);
create index if not exists idx_sheet_sync_status on public.sheet_sync_jobs(status);
create index if not exists idx_audit_logs_reg_id on public.audit_logs(registration_id);

-- ------------------------------------------------------------------------------
-- 10. ATOMIC REGISTRATION CONFIRMATION PROCEDURE
-- ------------------------------------------------------------------------------
create or replace function public.confirm_registration_and_activate_delegate(
  p_registration_id uuid,
  p_razorpay_order_id text,
  p_razorpay_payment_id text,
  p_amount integer,
  p_raw_metadata jsonb default null
) returns table (
  registration_number text,
  registration_status text,
  delegate_id uuid
) as $$
declare
  v_reg_number text;
  v_delegate_id uuid;
begin
  -- 1. Fetch or generate registration number
  select registration_number into v_reg_number
  from public.registrations
  where id = p_registration_id;

  if v_reg_number is null then
    v_reg_number := public.generate_registration_number();
  end if;

  -- 2. Update registration status to CONFIRMED
  update public.registrations
  set
    registration_number = v_reg_number,
    registration_status = 'CONFIRMED',
    confirmed_at = coalesce(confirmed_at, now()),
    updated_at = now()
  where id = p_registration_id;

  -- 3. Upsert / update payment attempt as CAPTURED
  update public.payment_attempts
  set
    razorpay_payment_id = p_razorpay_payment_id,
    status = 'CAPTURED',
    signature_verified = true,
    captured_at = coalesce(captured_at, now()),
    raw_provider_metadata = coalesce(p_raw_metadata, raw_provider_metadata),
    updated_at = now()
  where razorpay_order_id = p_razorpay_order_id;

  -- 4. Create or activate delegate record
  insert into public.delegates (registration_id, is_active)
  values (p_registration_id, true)
  on conflict (registration_id) do update
  set is_active = true, updated_at = now()
  returning id into v_delegate_id;

  -- 5. Queue Google Sheets sync job
  insert into public.sheet_sync_jobs (registration_id, status)
  values (p_registration_id, 'PENDING');

  -- 6. Record audit log
  insert into public.audit_logs (registration_id, action, actor_type, actor_identifier, metadata)
  values (
    p_registration_id,
    'REGISTRATION_CONFIRMED',
    'SYSTEM',
    'PAYMENT_ENGINE',
    jsonb_build_object(
      'order_id', p_razorpay_order_id,
      'payment_id', p_razorpay_payment_id,
      'amount', p_amount,
      'registration_number', v_reg_number
    )
  );

  return query select v_reg_number, 'CONFIRMED'::text, v_delegate_id;
end;
$$ language plpgsql;

-- ------------------------------------------------------------------------------
-- 11. STORAGE BUCKET CONFIGURATION (SUPABASE STORAGE)
-- ------------------------------------------------------------------------------
-- In Supabase Storage, run in SQL editor or UI:
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('registration-photos', 'registration-photos', false, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
-- on conflict (id) do nothing;

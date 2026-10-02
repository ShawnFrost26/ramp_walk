-- ==============================================================================
-- Dharti Aaba Veer Birsa Munda Jayanti 2026 — Ramp Walk Registration Web App
-- Migration 002: Registration Lifecycle, Pending vs Confirmed Separation,
-- Photo Validation & Fast Phone+DOB Login Index
-- ==============================================================================

-- 1. Update Registration Status Constraint to explicitly support PENDING_PAYMENT
alter table public.registrations
  drop constraint if exists registrations_registration_status_check;

alter table public.registrations
  add constraint registrations_registration_status_check
  check (registration_status in ('DRAFT', 'PENDING_PAYMENT', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'));

-- Set default status to PENDING_PAYMENT for new registrations
alter table public.registrations
  alter column registration_status set default 'PENDING_PAYMENT';

-- 2. Performance Composite Index for Delegate Login by Mobile Number + Date of Birth
create index if not exists idx_registrations_mobile_dob
  on public.registrations(mobile_number, date_of_birth);

-- 3. Update Sequence & Registration Number Generator (TH2026-XXXX format)
create or replace function public.generate_registration_number()
returns text as $$
begin
  -- Format: TH2026- followed by 4+ digits sequence (e.g., TH2026-1001)
  return 'TH2026-' || lpad(nextval('public.registration_number_seq')::text, 4, '0');
end;
$$ language plpgsql;

-- 4. Atomic Procedure: Confirm Registration and Activate Delegate
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

  if v_reg_number is null or v_reg_number = '' then
    v_reg_number := public.generate_registration_number();
  end if;

  -- 2. Transition status from PENDING_PAYMENT to CONFIRMED
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

  -- 4. Move to primary delegates table upon confirmation
  insert into public.delegates (registration_id, is_active, updated_at)
  values (p_registration_id, true, now())
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

-- 5. Storage Bucket Configuration Note (5 MB limit, JPG/PNG/WebP)
-- In Supabase Storage, run in SQL editor or UI:
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('registration-photos', 'registration-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
-- on conflict (id) do update set
--   file_size_limit = 5242880,
--   allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

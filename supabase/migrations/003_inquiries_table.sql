-- ==============================================================================
-- Dharti Aaba Veer Birsa Munda Jayanti 2026 — Ramp Walk Registration Web App
-- Migration 003: Inquiries and Delegate Support Resolution System
-- ==============================================================================

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique,
  name text not null,
  phone text not null,
  email text not null,
  category text not null default 'General Inquiry',
  message text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  admin_notes text,
  resolved_by text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for speedy filtering and admin search
create index if not exists idx_inquiries_status_created
  on public.inquiries(status, created_at desc);

create index if not exists idx_inquiries_phone_email
  on public.inquiries(phone, email);

-- Sequence & Trigger for ticket formatting (e.g. INQ-1001)
create sequence if not exists public.inquiry_number_seq start 1001;

create or replace function public.generate_inquiry_ticket_number()
returns trigger as $$
begin
  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number := 'INQ-' || nextval('public.inquiry_number_seq')::text;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inquiry_ticket_number on public.inquiries;

create trigger trg_inquiry_ticket_number
before insert on public.inquiries
for each row
execute function public.generate_inquiry_ticket_number();

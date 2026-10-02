-- ==============================================================================
-- Dharti Aaba Veer Birsa Munda Jayanti 2026 — Ramp Walk Registration Web App
-- Migration 005: Admin Access Requests & Sub-Admin Accounts (Max 20 Admins)
-- ==============================================================================

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- Admin Username (Exact case & spelling)
  email text not null unique, -- Admin Secret Key (Case-insensitive email)
  phone text not null,
  role text not null default 'SUB_ADMIN' check (role in ('SUPER_ADMIN', 'SUB_ADMIN')),
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'DISAPPROVED', 'REVOKED')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for speedy authentication and admin management
create index if not exists idx_admin_users_email on public.admin_users(email);
create index if not exists idx_admin_users_status on public.admin_users(status);
create index if not exists idx_admin_users_created on public.admin_users(created_at desc);

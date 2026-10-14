-- ============================================================
-- Dairy Yatra 2027 - Expression of Interest (EOI) schema
-- Run in: Supabase Dashboard -> SQL Editor
-- WARNING: Section 1 permanently deletes the old tables and their data.
-- ============================================================

-- ------------------------------------------------------------
-- 1. REMOVE THE OLD STRUCTURE
-- ------------------------------------------------------------
drop table if exists eoi_applications cascade;
drop table if exists applications     cascade;
drop table if exists submissions      cascade;
drop table if exists drafts           cascade;
drop table if exists cohorts          cascade;

drop function if exists generate_ref_id() cascade;
drop sequence if exists submissions_seq;
-- ------------------------------------------------------------
-- 2. EOI APPLICATIONS (Step 1 Profile + Step 2 Dairy Experience)
-- ------------------------------------------------------------
create table eoi_applications (
  id             uuid primary key default gen_random_uuid(),
  application_id text not null unique,                 -- e.g. DY-2027-123456

  -- Selection status. Only the admin (service role) changes this.
  status text not null default 'SUBMITTED'
    check (status in ('SUBMITTED', 'SHORTLISTED', 'WAITLISTED', 'REJECTED')),

  -- Step 1: Profile
  full_name     text not null check (char_length(full_name) between 3 and 100),
  dob           date not null,                         -- age is calculated, never stored
  gender        text not null check (gender in ('Male', 'Female', 'Other')),
  whatsapp      text not null unique check (whatsapp ~ '^[6-9][0-9]{9}$'),
  secondary_no  text check (secondary_no is null or secondary_no ~ '^[6-9][0-9]{9}$'),
  email         text check (email is null or char_length(email) <= 150),
  address       text not null check (char_length(address) between 10 and 500),
  city          text not null,
  state         text not null,
  occupation    text not null,
  organization  text,

  -- Step 2: Dairy Experience
  wants_scholarship boolean not null default false,
  scholarship_reason text,
  prior_experience      text,
  motivation            text,
  learning_expectations text,

  -- Admin use
  admin_notes   text,
  shortlisted_at timestamptz,

  submitted_at  timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (not wants_scholarship or nullif(btrim(scholarship_reason), '') is not null)
);

-- One application per supplied email (case-insensitive). WhatsApp is already unique above.
create unique index eoi_email_unique on eoi_applications (lower(email))
  where email is not null and email <> '';
create index eoi_status_idx    on eoi_applications (status);
create index eoi_submitted_idx on eoi_applications (submitted_at desc);

-- ------------------------------------------------------------
-- 3. AUTO-UPDATE updated_at, AND STAMP shortlisted_at
-- ------------------------------------------------------------
create or replace function eoi_before_update() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'SHORTLISTED' and old.status is distinct from 'SHORTLISTED' then
    new.shortlisted_at := now();
  end if;
  return new;
end $$;

create trigger eoi_before_update_trg
before update on eoi_applications
for each row execute function eoi_before_update();

-- ------------------------------------------------------------
-- 4. SECURITY: only your backend (service role key) can touch this table
-- ------------------------------------------------------------
alter table eoi_applications enable row level security;   -- no policies = no public access
revoke all on eoi_applications from anon, authenticated;

-- ------------------------------------------------------------
-- 5. CHECK
-- ------------------------------------------------------------
-- select table_name from information_schema.tables where table_schema = 'public';
-- Expected: only eoi_applications
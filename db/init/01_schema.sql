-- ============================================================
-- Dairy Yatra 2027 - Expression of Interest (EOI) schema
-- Runs automatically ONCE, when the Postgres container starts with an empty data volume.
-- Safe to run again by hand: nothing is dropped, everything uses "if not exists".
-- ============================================================

-- ------------------------------------------------------------
-- 1. SHOW TIMES IN INDIA TIME (IST)
-- Stored values are absolute moments either way; this only changes how they are displayed.
-- ------------------------------------------------------------
do $$
begin
  execute format('alter database %I set timezone to %L', current_database(), 'Asia/Kolkata');
end $$;
set timezone to 'Asia/Kolkata';

-- ------------------------------------------------------------
-- 2. EOI APPLICATIONS (Step 1 Profile + Step 2 Dairy Experience)
-- ------------------------------------------------------------
create table if not exists eoi_applications (
  id             uuid primary key default gen_random_uuid(),
  application_id text not null unique,                 -- e.g. DY-2027-123456 (constraint name used by server.js)

  -- Selection status. Only the admin changes this.
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
  wants_scholarship  boolean not null default false,
  scholarship_reason text,
  prior_experience      text,
  motivation            text,
  learning_expectations text,

  -- Admin use
  admin_notes    text,
  shortlisted_at timestamptz,

  submitted_at  timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint eoi_scholarship_reason_check
    check (not wants_scholarship or nullif(btrim(scholarship_reason), '') is not null)
);

-- One application per supplied email (case-insensitive). WhatsApp is already unique above.
create unique index if not exists eoi_email_unique on eoi_applications (lower(email))
  where email is not null and email <> '';
create index if not exists eoi_status_idx    on eoi_applications (status);
create index if not exists eoi_submitted_idx on eoi_applications (submitted_at desc);

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

drop trigger if exists eoi_before_update_trg on eoi_applications;
create trigger eoi_before_update_trg
before update on eoi_applications
for each row execute function eoi_before_update();

-- ------------------------------------------------------------
-- 4. ACCESS
-- Only the backend container connects (as user "dairy"). The database port is not public,
-- so Supabase's row level security and anon/authenticated roles are not needed here.
-- ------------------------------------------------------------

-- Check: \dt  -> should list only eoi_applications

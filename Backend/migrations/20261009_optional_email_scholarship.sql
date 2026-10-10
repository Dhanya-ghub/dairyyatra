alter table eoi_applications
  alter column email drop not null,
  add column wants_scholarship boolean not null default false,
  add column scholarship_reason text;

alter table eoi_applications
  add constraint eoi_scholarship_reason_check
  check (not wants_scholarship or nullif(btrim(scholarship_reason), '') is not null);

drop index if exists eoi_email_unique;

create unique index eoi_email_unique on eoi_applications (lower(email))
  where email is not null and email <> '';

-- Job Search App — initial schema
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Every table is scoped to auth.uid() via Row-Level Security, so even
-- though this is a single-user prototype today, opening it to other
-- users later needs no schema changes — just more people signing in.

-- ---------------------------------------------------------------------
-- resume_templates: your master resume, as structured JSON + the
-- original uploaded file (stored in Supabase Storage, see bucket below).
-- ---------------------------------------------------------------------
create table if not exists resume_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Master Resume',
  content jsonb not null default '{}'::jsonb, -- structured: summary, experience[], skills[], education[]
  original_file_path text, -- path in the "resumes" storage bucket
  original_file_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- applications: one row per job applied to.
-- ---------------------------------------------------------------------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  title text not null,
  status text not null default 'saved'
    check (status in ('saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn')),
  job_url text,
  job_description text,
  location text,
  remote boolean,
  salary_min integer,
  salary_max integer,
  source text, -- e.g. "LinkedIn", "referral", "company site"
  applied_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- tailored_resumes: a generated resume variant tied to one application.
-- ---------------------------------------------------------------------
create table if not exists tailored_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  resume_template_id uuid references resume_templates(id) on delete set null,
  content jsonb not null default '{}'::jsonb, -- same shape as resume_templates.content
  model text, -- which Claude model generated this version
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- followups: reminders tied to an application.
-- ---------------------------------------------------------------------
create table if not exists followups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  due_date date not null,
  type text not null default 'check-in' check (type in ('thank-you', 'check-in', 'other')),
  notes text,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resume_templates_set_updated_at on resume_templates;
create trigger resume_templates_set_updated_at
  before update on resume_templates
  for each row execute function set_updated_at();

drop trigger if exists applications_set_updated_at on applications;
create trigger applications_set_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Row-Level Security: each table, users can only touch their own rows.
-- ---------------------------------------------------------------------
alter table resume_templates enable row level security;
alter table applications enable row level security;
alter table tailored_resumes enable row level security;
alter table followups enable row level security;

create policy "own resume_templates" on resume_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own applications" on applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own tailored_resumes" on tailored_resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own followups" on followups
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Storage: private bucket for uploaded resume files (PDF/DOCX).
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Files are stored under a path prefixed with the user's own id,
-- e.g. "{user_id}/original.pdf" — these policies enforce that prefix.
create policy "own resume files select" on storage.objects
  for select using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "own resume files insert" on storage.objects
  for insert with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "own resume files update" on storage.objects
  for update using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "own resume files delete" on storage.objects
  for delete using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

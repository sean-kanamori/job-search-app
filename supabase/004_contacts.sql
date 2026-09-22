-- Recruiter / hiring manager contacts, scoped to one application.
-- Run once in the Supabase SQL Editor.

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  name text not null,
  role text, -- free text: "Recruiter", "Hiring Manager", "Referral", etc.
  email text,
  phone text,
  linkedin_url text,
  notes text,
  created_at timestamptz not null default now()
);

alter table contacts enable row level security;

create policy "own contacts" on contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

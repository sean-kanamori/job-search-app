-- Tracks per-user app state, starting with whether they've completed
-- the onboarding walkthrough. Room to grow (display name, avatar,
-- preferences) without touching auth.users. Run once in the
-- Supabase SQL Editor.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

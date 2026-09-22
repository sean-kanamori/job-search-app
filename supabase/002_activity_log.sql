-- Adds the activity log used by the Activity tab.
-- Run this once in the Supabase SQL Editor (schema.sql was already
-- applied, so this is an incremental addition, not a replacement).

create table if not exists application_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  event_type text not null, -- e.g. "created", "status_change", "followup_suggested", "followup_added", "followup_completed"
  description text not null,
  occurred_at timestamptz not null default now()
);

alter table application_events enable row level security;

create policy "own application_events" on application_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

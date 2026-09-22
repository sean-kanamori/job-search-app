-- Adds a resume-template link and a structured source (with an
-- optional referral name) to applications. Run once in the
-- Supabase SQL Editor.

alter table applications
  add column if not exists resume_template_id uuid references resume_templates(id) on delete set null;

alter table applications
  add column if not exists referral_name text;

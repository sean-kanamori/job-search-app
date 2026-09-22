-- Lets a follow-up reminder optionally be tied to a contact on the
-- same application (e.g. "thank-you email" -> the interviewer).
-- Run once in the Supabase SQL Editor.

alter table followups
  add column if not exists contact_id uuid references contacts(id) on delete set null;

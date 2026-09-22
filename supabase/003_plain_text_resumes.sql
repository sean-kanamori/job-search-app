-- Switches resume storage from structured JSON to plain extracted/
-- cleaned text — tailoring will be a freeform Claude rewrite rather
-- than field-level editing, so there's no need to force resumes
-- into a fixed shape. Run once in the Supabase SQL Editor.

alter table resume_templates drop column if exists content;
alter table resume_templates add column content text not null default '';

alter table tailored_resumes drop column if exists content;
alter table tailored_resumes add column content text not null default '';

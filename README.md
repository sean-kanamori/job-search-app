# Milo

Your companion for the job search — a Claude-powered application
tracker built to stay on top of applications, follow-ups, and contacts
in one place, without duct-taping together a spreadsheet.

## Features

- **Application tracker** — company, title, status, salary range,
  location, source, and job description, with dashboard filters for
  status, company search, and pending reminders.
- **Resume templates** — upload a resume as a PDF or DOCX; Claude reads
  and transcribes it to clean, editable text, stored alongside the
  original file. Multiple named templates are supported, and each
  application can reference which one was used.
- **Follow-up reminders** — status changes propose a relevant follow-up
  automatically (a check-in a week after applying, a thank-you note the
  day after an interview), and closing out an application (rejected or
  withdrawn) clears any reminders that no longer apply.
- **Contacts** — track recruiters, hiring managers, and interviewers per
  application, and tie a reminder to a specific person.
- **Activity log** — an automatic, read-only history of what happened on
  each application: status changes, reminders suggested/added/completed,
  contacts added.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- [Supabase](https://supabase.com) — Postgres, Auth (email + password), and
  Storage, with Row-Level Security scoping every table to the signed-in
  user
- [Anthropic API](https://www.anthropic.com/api) (`claude-sonnet-5`) for
  resume text extraction, via [`@anthropic-ai/sdk`](https://github.com/anthropics/anthropic-sdk-typescript)
- [`mammoth`](https://github.com/mwilliamson/mammoth.js) for DOCX text
  extraction (PDFs are read natively by Claude)

## Architecture notes

- **Server Actions, not a separate API layer** — reads happen in Server
  Components, writes go through `"use server"` actions colocated with
  the routes that use them (`app/(app)/applications/actions.ts`,
  `app/(app)/resumes/actions.ts`).
- **RLS does the access control.** Every table has a policy scoping rows
  to `auth.uid()`, so a bug in application code can't leak another
  user's data — the database itself refuses the query.
- **Plain text over structured JSON for resumes.** Tailoring a resume
  for a specific job is a freeform rewrite, not a fill-in-the-blanks
  form, so the extracted resume content is stored as text rather than
  forced into a fixed schema.

## Getting started

1. Create a [Supabase](https://supabase.com) project and an
   [Anthropic](https://console.anthropic.com) API key.
2. Copy `.env.local.example` (or create `.env.local`) with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ANTHROPIC_API_KEY=
   ```

3. Run the SQL files in `supabase/` **in order** via the Supabase SQL
   Editor (`schema.sql` first, then `002_...` through `006_...`).
4. Set `INVITE_CODE` in `.env.local` to a value of your choosing, then
   either create your own user directly in **Supabase → Authentication
   → Users** (with "Auto Confirm User" enabled), or sign up through the
   app at `/signup` using that invite code.
5. Install and run:

   ```bash
   npm install
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and sign in.

## Project structure

```
app/(app)/            Protected routes (auth-gated by the route group's layout)
  applications/        Tracker: list, add, edit, per-application Activity tab
  resumes/              Resume template upload, extraction, and editing
lib/supabase/          Browser, server, and admin Supabase clients + auth helper
lib/anthropic.ts       Claude-backed resume text extraction
supabase/               SQL schema and incremental migrations, run in order
```

-- Seeds realistic demo data (resumes, applications, follow-ups,
-- contacts, activity log) under your own account, for taking
-- screenshots of a populated app. Safe to run once in the Supabase
-- SQL Editor. A cleanup query to remove it all afterward is at the
-- bottom of this file — run that when you're done screenshotting.

do $$
declare
  v_user_id uuid;
  v_resume_main uuid;
  v_resume_pm uuid;
  v_app_acme uuid;
  v_app_brightpath uuid;
  v_app_nova uuid;
  v_app_wellspring uuid;
  v_app_fenwick uuid;
  v_contact_jordan uuid;
  v_contact_morgan uuid;
begin
  select id into v_user_id from auth.users where email = 'sean.kanamori@gmail.com';
  if v_user_id is null then
    raise exception 'No user found with that email — update the email in this script.';
  end if;

  -- Resume templates -------------------------------------------------
  insert into resume_templates (user_id, name, content, original_file_name)
  values (
    v_user_id,
    'Main Resume',
    E'Sean Kanamori\nProduct Designer\nsean.kanamori@gmail.com | (555) 012-3456 | San Francisco, CA\n\nSummary\nProduct designer with 6+ years shipping consumer and B2B software. Focused on design systems, rapid prototyping, and cross-functional collaboration with engineering and product.\n\nExperience\n\nSenior Product Designer — Fieldstone Software (2022-Present)\n- Led redesign of core onboarding flow, improving activation by 18%\n- Built and maintained a company-wide design system used by 4 product teams\n- Partnered with PM and eng leads on quarterly roadmap planning\n\nProduct Designer — Harbor Analytics (2019-2022)\n- Designed dashboard and reporting tools for enterprise customers\n- Ran user research and usability testing for major feature launches\n\nEducation\nB.A. Design, University of Washington\n\nSkills\nFigma, prototyping, design systems, user research, HTML/CSS',
    'sean-kanamori-resume.pdf'
  ) returning id into v_resume_main;

  insert into resume_templates (user_id, name, content, original_file_name)
  values (
    v_user_id,
    'Product Manager Resume',
    E'Sean Kanamori\nProduct Manager\nsean.kanamori@gmail.com | (555) 012-3456 | San Francisco, CA\n\nSummary\nProduct-minded generalist with a design background, now focused on product management. Comfortable owning roadmap, working directly with engineering, and talking to customers.\n\nExperience\n\nSenior Product Designer — Fieldstone Software (2022-Present)\n- Partnered with PM on roadmap prioritization and quarterly planning\n- Ran discovery interviews and synthesized findings into product requirements\n\nProduct Designer — Harbor Analytics (2019-2022)\n- Owned end-to-end feature delivery from discovery through launch\n\nEducation\nB.A. Design, University of Washington',
    'sean-kanamori-pm-resume.docx'
  ) returning id into v_resume_pm;

  -- Applications -------------------------------------------------------
  insert into applications (user_id, company, title, status, job_url, location, remote, salary_min, salary_max, source, applied_date, resume_template_id, notes)
  values (v_user_id, 'Acme Robotics', 'Senior Product Designer', 'interviewing', 'https://acme-robotics.example.com/jobs/1042', 'Remote', true, 120000, 150000, 'LinkedIn', current_date - 9, v_resume_main, 'Phone screen went well, onsite loop scheduled.')
  returning id into v_app_acme;

  insert into applications (user_id, company, title, status, location, remote, salary_min, salary_max, source, applied_date, resume_template_id)
  values (v_user_id, 'Bright Path Health', 'Product Manager', 'applied', 'Austin, TX', false, 110000, 130000, 'Company website', current_date - 14, v_resume_pm)
  returning id into v_app_brightpath;

  insert into applications (user_id, company, title, status, location, remote, source)
  values (v_user_id, 'Nova Analytics', 'Data Analyst', 'saved', 'Chicago, IL', false, 'Other job board')
  returning id into v_app_nova;

  insert into applications (user_id, company, title, status, location, remote, salary_min, salary_max, source, referral_name, applied_date, resume_template_id)
  values (v_user_id, 'Wellspring Labs', 'UX Researcher', 'offer', 'Remote', true, 100000, 115000, 'Referral', 'Jamie Chen', current_date - 21, v_resume_main)
  returning id into v_app_wellspring;

  insert into applications (user_id, company, title, status, location, remote, source, applied_date)
  values (v_user_id, 'Fenwick & Co', 'Marketing Lead', 'rejected', 'New York, NY', false, 'LinkedIn', current_date - 30)
  returning id into v_app_fenwick;

  -- Contacts -------------------------------------------------------------
  insert into contacts (user_id, application_id, name, role, email, linkedin_url)
  values (v_user_id, v_app_acme, 'Jordan Lee', 'Recruiter', 'jordan.lee@acme-robotics.example.com', 'https://linkedin.com/in/jordanlee-example')
  returning id into v_contact_jordan;

  insert into contacts (user_id, application_id, name, role, email)
  values (v_user_id, v_app_brightpath, 'Morgan Patel', 'Hiring Manager', 'morgan.patel@brightpathhealth.example.com')
  returning id into v_contact_morgan;

  -- Follow-ups -------------------------------------------------------------
  insert into followups (user_id, application_id, due_date, type, notes, contact_id)
  values (v_user_id, v_app_acme, current_date + 2, 'thank-you', 'Send a thank-you note after the onsite.', v_contact_jordan);

  insert into followups (user_id, application_id, due_date, type, notes, contact_id)
  values (v_user_id, v_app_brightpath, current_date - 3, 'check-in', 'Check in if you haven''t heard back yet.', v_contact_morgan);

  -- Activity log -------------------------------------------------------------
  insert into application_events (user_id, application_id, event_type, description, occurred_at)
  values
    (v_user_id, v_app_acme, 'created', 'Application created for Senior Product Designer at Acme Robotics.', now() - interval '9 days'),
    (v_user_id, v_app_acme, 'status_change', 'Status changed from Applied to Interviewing.', now() - interval '3 days'),
    (v_user_id, v_app_acme, 'followup_suggested', 'Suggested a thank-you follow-up.', now() - interval '3 days'),
    (v_user_id, v_app_acme, 'contact_added', 'Added contact: Jordan Lee (Recruiter).', now() - interval '8 days'),
    (v_user_id, v_app_brightpath, 'created', 'Application created for Product Manager at Bright Path Health.', now() - interval '14 days'),
    (v_user_id, v_app_brightpath, 'followup_suggested', 'Suggested a check-in follow-up.', now() - interval '14 days'),
    (v_user_id, v_app_brightpath, 'contact_added', 'Added contact: Morgan Patel (Hiring Manager).', now() - interval '13 days'),
    (v_user_id, v_app_wellspring, 'created', 'Application created for UX Researcher at Wellspring Labs.', now() - interval '21 days'),
    (v_user_id, v_app_wellspring, 'status_change', 'Status changed from Interviewing to Offer.', now() - interval '2 days'),
    (v_user_id, v_app_fenwick, 'created', 'Application created for Marketing Lead at Fenwick & Co.', now() - interval '30 days'),
    (v_user_id, v_app_fenwick, 'status_change', 'Status changed from Applied to Rejected.', now() - interval '5 days');

  raise notice 'Demo data seeded.';
end $$;

-- ---------------------------------------------------------------------
-- CLEANUP — run this separately once you're done screenshotting.
-- Deletes only the demo rows above (matched by company name);
-- everything else you've added stays untouched.
-- ---------------------------------------------------------------------

-- delete from applications
--   where user_id = (select id from auth.users where email = 'sean.kanamori@gmail.com')
--   and company in ('Acme Robotics', 'Bright Path Health', 'Nova Analytics', 'Wellspring Labs', 'Fenwick & Co');
--
-- delete from resume_templates
--   where user_id = (select id from auth.users where email = 'sean.kanamori@gmail.com')
--   and name in ('Main Resume', 'Product Manager Resume');

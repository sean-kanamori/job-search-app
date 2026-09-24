import type {
  Application,
  ApplicationEvent,
  Contact,
  Followup,
  ResumeTemplate,
} from "@/lib/types";

// Static fixture data for the public, read-only /showcase routes.
// No Supabase, no auth, no server actions touch this data — it's
// baked into the deploy. Mirrors supabase/seed_demo_data.sql so the
// showcase matches what's already been screenshotted for the guide.

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const daysAgoIso = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const showcaseResumes: ResumeTemplate[] = [
  {
    id: "resume-main",
    user_id: "demo",
    name: "Main Resume",
    content:
      "Sean Kanamori\nProduct Designer\nsean.kanamori@gmail.com | (555) 012-3456 | San Francisco, CA\n\nSummary\nProduct designer with 6+ years shipping consumer and B2B software. Focused on design systems, rapid prototyping, and cross-functional collaboration with engineering and product.\n\nExperience\n\nSenior Product Designer — Fieldstone Software (2022-Present)\n- Led redesign of core onboarding flow, improving activation by 18%\n- Built and maintained a company-wide design system used by 4 product teams\n- Partnered with PM and eng leads on quarterly roadmap planning\n\nProduct Designer — Harbor Analytics (2019-2022)\n- Designed dashboard and reporting tools for enterprise customers\n- Ran user research and usability testing for major feature launches\n\nEducation\nB.A. Design, University of Washington\n\nSkills\nFigma, prototyping, design systems, user research, HTML/CSS",
    original_file_path: null,
    original_file_name: "sean-kanamori-resume.pdf",
    is_active: true,
    created_at: daysAgoIso(24),
    updated_at: daysAgoIso(1),
  },
  {
    id: "resume-pm",
    user_id: "demo",
    name: "Product Manager Resume",
    content:
      "Sean Kanamori\nProduct Manager\nsean.kanamori@gmail.com | (555) 012-3456 | San Francisco, CA\n\nSummary\nProduct-minded generalist with a design background, now focused on product management. Comfortable owning roadmap, working directly with engineering, and talking to customers.\n\nExperience\n\nSenior Product Designer — Fieldstone Software (2022-Present)\n- Partnered with PM on roadmap prioritization and quarterly planning\n- Ran discovery interviews and synthesized findings into product requirements\n\nProduct Designer — Harbor Analytics (2019-2022)\n- Owned end-to-end feature delivery from discovery through launch\n\nEducation\nB.A. Design, University of Washington",
    original_file_path: null,
    original_file_name: "sean-kanamori-pm-resume.docx",
    is_active: true,
    created_at: daysAgoIso(24),
    updated_at: daysAgoIso(1),
  },
];

export const showcaseApplications: Application[] = [
  {
    id: "app-acme",
    user_id: "demo",
    company: "Acme Robotics",
    title: "Senior Product Designer",
    status: "interviewing",
    job_url: "https://acme-robotics.example.com/jobs/1042",
    job_description: null,
    location: "Remote",
    remote: true,
    salary_min: 120000,
    salary_max: 150000,
    source: "LinkedIn",
    referral_name: null,
    resume_template_id: "resume-main",
    applied_date: daysAgo(9),
    notes: "Phone screen went well, onsite loop scheduled.",
    created_at: daysAgoIso(9),
    updated_at: daysAgoIso(3),
  },
  {
    id: "app-brightpath",
    user_id: "demo",
    company: "Bright Path Health",
    title: "Product Manager",
    status: "applied",
    job_url: null,
    job_description: null,
    location: "Austin, TX",
    remote: false,
    salary_min: 110000,
    salary_max: 130000,
    source: "Company website",
    referral_name: null,
    resume_template_id: "resume-pm",
    applied_date: daysAgo(14),
    notes: null,
    created_at: daysAgoIso(14),
    updated_at: daysAgoIso(14),
  },
  {
    id: "app-nova",
    user_id: "demo",
    company: "Nova Analytics",
    title: "Data Analyst",
    status: "saved",
    job_url: null,
    job_description: null,
    location: "Chicago, IL",
    remote: false,
    salary_min: null,
    salary_max: null,
    source: "Other job board",
    referral_name: null,
    resume_template_id: null,
    applied_date: null,
    notes: null,
    created_at: daysAgoIso(5),
    updated_at: daysAgoIso(5),
  },
  {
    id: "app-wellspring",
    user_id: "demo",
    company: "Wellspring Labs",
    title: "UX Researcher",
    status: "offer",
    job_url: null,
    job_description: null,
    location: "Remote",
    remote: true,
    salary_min: 100000,
    salary_max: 115000,
    source: "Referral",
    referral_name: "Jamie Chen",
    resume_template_id: "resume-main",
    applied_date: daysAgo(21),
    notes: null,
    created_at: daysAgoIso(21),
    updated_at: daysAgoIso(2),
  },
  {
    id: "app-fenwick",
    user_id: "demo",
    company: "Fenwick & Co",
    title: "Marketing Lead",
    status: "rejected",
    job_url: null,
    job_description: null,
    location: "New York, NY",
    remote: false,
    salary_min: null,
    salary_max: null,
    source: "LinkedIn",
    referral_name: null,
    resume_template_id: null,
    applied_date: daysAgo(30),
    notes: null,
    created_at: daysAgoIso(30),
    updated_at: daysAgoIso(5),
  },
];

export const showcaseContacts: Contact[] = [
  {
    id: "contact-jordan",
    user_id: "demo",
    application_id: "app-acme",
    name: "Jordan Lee",
    role: "Recruiter",
    email: "jordan.lee@acme-robotics.example.com",
    phone: null,
    linkedin_url: "https://linkedin.com/in/jordanlee-example",
    notes: null,
    created_at: daysAgoIso(8),
  },
  {
    id: "contact-morgan",
    user_id: "demo",
    application_id: "app-brightpath",
    name: "Morgan Patel",
    role: "Hiring Manager",
    email: "morgan.patel@brightpathhealth.example.com",
    phone: null,
    linkedin_url: null,
    notes: null,
    created_at: daysAgoIso(13),
  },
];

export const showcaseFollowups: Followup[] = [
  {
    id: "followup-acme-thankyou",
    user_id: "demo",
    application_id: "app-acme",
    due_date: daysFromNow(2),
    type: "thank-you",
    notes: "Send a thank-you note after the onsite.",
    done: false,
    contact_id: "contact-jordan",
    created_at: daysAgoIso(3),
  },
  {
    id: "followup-brightpath-checkin",
    user_id: "demo",
    application_id: "app-brightpath",
    due_date: daysAgo(3),
    type: "check-in",
    notes: "Check in if you haven't heard back yet.",
    done: false,
    contact_id: "contact-morgan",
    created_at: daysAgoIso(14),
  },
];

export const showcaseEvents: ApplicationEvent[] = [
  { id: "e1", user_id: "demo", application_id: "app-acme", event_type: "created", description: "Application created for Senior Product Designer at Acme Robotics.", occurred_at: daysAgoIso(9) },
  { id: "e2", user_id: "demo", application_id: "app-acme", event_type: "contact_added", description: "Added contact: Jordan Lee (Recruiter).", occurred_at: daysAgoIso(8) },
  { id: "e3", user_id: "demo", application_id: "app-acme", event_type: "status_change", description: "Status changed from Applied to Interviewing.", occurred_at: daysAgoIso(3) },
  { id: "e4", user_id: "demo", application_id: "app-acme", event_type: "followup_suggested", description: "Suggested a thank-you follow-up.", occurred_at: daysAgoIso(3) },
  { id: "e5", user_id: "demo", application_id: "app-brightpath", event_type: "created", description: "Application created for Product Manager at Bright Path Health.", occurred_at: daysAgoIso(14) },
  { id: "e6", user_id: "demo", application_id: "app-brightpath", event_type: "contact_added", description: "Added contact: Morgan Patel (Hiring Manager).", occurred_at: daysAgoIso(13) },
  { id: "e7", user_id: "demo", application_id: "app-brightpath", event_type: "followup_suggested", description: "Suggested a check-in follow-up.", occurred_at: daysAgoIso(14) },
  { id: "e8", user_id: "demo", application_id: "app-wellspring", event_type: "created", description: "Application created for UX Researcher at Wellspring Labs.", occurred_at: daysAgoIso(21) },
  { id: "e9", user_id: "demo", application_id: "app-wellspring", event_type: "status_change", description: "Status changed from Interviewing to Offer.", occurred_at: daysAgoIso(2) },
  { id: "e10", user_id: "demo", application_id: "app-fenwick", event_type: "created", description: "Application created for Marketing Lead at Fenwick & Co.", occurred_at: daysAgoIso(30) },
  { id: "e11", user_id: "demo", application_id: "app-fenwick", event_type: "status_change", description: "Status changed from Applied to Rejected.", occurred_at: daysAgoIso(5) },
];

export function getShowcaseApplication(id: string) {
  return showcaseApplications.find((a) => a.id === id) ?? null;
}

export function getShowcaseResume(id: string) {
  return showcaseResumes.find((r) => r.id === id) ?? null;
}

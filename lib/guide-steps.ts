export type GuideStep = {
  image: string;
  headline: string;
  body: string;
  screenshot: { src: string; width: number; height: number } | null;
};

// Shared by the real onboarding walkthrough (/guide) and the public
// showcase's copy of it (/showcase/guide) — same content, different
// "finish" behavior per page.
export const GUIDE_STEPS: GuideStep[] = [
  {
    image: "/mascot.png",
    headline: "Hi, I'm Cora",
    body: "I'm your Career Organizer & Reminder Assistant. Give me a minute to show you around — it'll make the rest of your search a lot smoother.",
    screenshot: null,
  },
  {
    image: "/mascot-document.png",
    headline: "Upload once, reuse everywhere",
    body: "Drop in a PDF or DOCX and I'll pull out the text so it's ready to edit. Keep a few versions around — you'll be able to link the right one to each application.",
    screenshot: { src: "/screenshot-resumes.png", width: 1058, height: 376 },
  },
  {
    image: "/mascot-pointing.png",
    headline: "Track every application",
    body: "Add a company and title, and I'll track its status, salary, source, and which resume you used. Filter by status, search by company, or jump straight to what needs attention.",
    screenshot: { src: "/screenshot-applications.png", width: 1032, height: 474 },
  },
  {
    image: "/mascot-bell.png",
    headline: "I'll remind you to follow up",
    body: "When you mark something applied or interviewing, I'll suggest a follow-up automatically. Add contacts too, so a reminder can point straight at who it's for.",
    screenshot: { src: "/screenshot-activity.png", width: 693, height: 777 },
  },
  {
    image: "/mascot-thumbsup.png",
    headline: "That's the whole tour",
    body: "You can always come back to this from the \"How to use\" tab. Let's get started.",
    screenshot: null,
  },
];

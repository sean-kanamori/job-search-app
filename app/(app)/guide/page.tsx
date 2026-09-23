"use client";

import { useState } from "react";
import Image from "next/image";
import { completeOnboarding } from "./actions";

const STEPS = [
  {
    image: "/mascot.png",
    headline: "Hi, I'm Cora",
    body: "I'm your Career Organizer & Reminder Assistant. Give me a minute to show you around — it'll make the rest of your search a lot smoother.",
  },
  {
    image: "/mascot-document.png",
    headline: "Upload once, reuse everywhere",
    body: "Drop in a PDF or DOCX and I'll pull out the text so it's ready to edit. Keep a few versions around — you'll be able to link the right one to each application.",
  },
  {
    image: "/mascot-pointing.png",
    headline: "Track every application",
    body: "Add a company and title, and I'll track its status, salary, source, and which resume you used. Filter by status, search by company, or jump straight to what needs attention.",
  },
  {
    image: "/mascot-bell.png",
    headline: "I'll remind you to follow up",
    body: "When you mark something applied or interviewing, I'll suggest a follow-up automatically. Add contacts too, so a reminder can point straight at who it's for.",
  },
  {
    image: "/mascot-thumbsup.png",
    headline: "That's the whole tour",
    body: "You can always come back to this from the \"How to use\" tab. Let's get started.",
  },
];

export default function GuidePage() {
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  async function finish() {
    setPending(true);
    await completeOnboarding();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center">
      <Image
        key={current.image + step}
        src={current.image}
        alt=""
        width={140}
        height={140}
        priority
        aria-hidden="true"
      />
      <h1 className="mt-4 text-xl font-semibold text-stone-900">
        {current.headline}
      </h1>
      <p className="mt-2 text-sm text-stone-600">{current.body}</p>

      <div className="mt-6 flex gap-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === step ? "bg-accent" : "bg-stone-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={isFirst}
          className="text-sm text-stone-500 hover:text-stone-900 disabled:opacity-0"
        >
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={finish}
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {pending ? "One sec…" : "Get started"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Next
          </button>
        )}
      </div>

      {!isLast && (
        <button
          type="button"
          onClick={finish}
          className="mt-4 text-xs text-stone-400 hover:text-stone-600 hover:underline"
        >
          Skip
        </button>
      )}
    </div>
  );
}

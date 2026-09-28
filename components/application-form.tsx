"use client";

import { useActionState, useState } from "react";
import { ApplicationFields } from "./application-fields";
import { JobPostingParser } from "./job-posting-parser";
import { SubmitButton } from "./submit-button";
import type { Application } from "@/lib/types";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import type { ParsedJobPosting } from "@/lib/anthropic";

function toDefaults(
  parsed:
    | (ParsedJobPosting & { job_url: string; source: string | null })
    | null
): Partial<Application> | undefined {
  if (!parsed) return undefined;
  return {
    company: parsed.company ?? undefined,
    title: parsed.title ?? undefined,
    location: parsed.location ?? undefined,
    remote: parsed.remote ?? undefined,
    salary_min: parsed.salary_min ?? undefined,
    salary_max: parsed.salary_max ?? undefined,
    job_description: parsed.job_description ?? undefined,
    job_url: parsed.job_url,
    source: parsed.source ?? undefined,
  };
}

export function ApplicationForm({
  action,
  defaultValues,
  resumeTemplates = [],
  submitLabel,
  showUrlParser = false,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Application>;
  resumeTemplates?: { id: string; name: string }[];
  submitLabel: string;
  showUrlParser?: boolean;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const [parsed, setParsed] = useState<
    (ParsedJobPosting & { job_url: string; source: string | null }) | null
  >(null);

  const mergedDefaults = { ...defaultValues, ...toDefaults(parsed) };

  return (
    <form action={formAction} className="space-y-4">
      {showUrlParser && <JobPostingParser onParsed={setParsed} />}
      <ApplicationFields
        key={JSON.stringify(mergedDefaults)}
        defaultValues={mergedDefaults}
        resumeTemplates={resumeTemplates}
      />
      <SubmitButton pendingLabel="Saving…">{submitLabel}</SubmitButton>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { ApplicationFields } from "./application-fields";
import { SubmitButton } from "./submit-button";
import type { Application } from "@/lib/types";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";

export function ApplicationForm({
  action,
  defaultValues,
  resumeTemplates = [],
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Application>;
  resumeTemplates?: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <ApplicationFields
        defaultValues={defaultValues}
        resumeTemplates={resumeTemplates}
      />
      <SubmitButton pendingLabel="Saving…">{submitLabel}</SubmitButton>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}

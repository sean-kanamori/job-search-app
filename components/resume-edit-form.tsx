"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { initialActionState } from "@/lib/action-state";
import type { ResumeTemplate } from "@/lib/types";
import { updateResumeTemplate } from "@/app/(app)/resumes/actions";

export function ResumeEditForm({
  template,
  originalFileUrl,
}: {
  template: ResumeTemplate;
  originalFileUrl: string | null;
}) {
  const action = updateResumeTemplate.bind(null, template.id);
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </span>
        <input
          name="name"
          required
          defaultValue={template.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Content
        </span>
        <textarea
          name="content"
          rows={22}
          defaultValue={template.content}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-gray-500 focus:outline-none"
        />
      </label>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm text-gray-700">
          {template.original_file_name ? (
            <>
              Original file:{" "}
              {originalFileUrl ? (
                <a href={originalFileUrl} className="text-gray-900 underline">
                  {template.original_file_name}
                </a>
              ) : (
                template.original_file_name
              )}
            </>
          ) : (
            "No original file on record."
          )}
        </p>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Replace file (re-extracts and overwrites content above)
          </span>
          <input
            type="file"
            name="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>

      <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}

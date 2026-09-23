"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { initialActionState } from "@/lib/action-state";
import { uploadResumeTemplate } from "../actions";

export default function NewResumePage() {
  const [state, formAction] = useActionState(
    uploadResumeTemplate,
    initialActionState
  );

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">
          Upload a resume
        </h1>
        <Link href="/resumes" className="text-sm text-stone-500 hover:underline">
          Cancel
        </Link>
      </div>

      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">
            Name
          </span>
          <input
            name="name"
            required
            placeholder="e.g. Main Resume, PM Resume"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">
            File (PDF or DOCX)
          </span>
          <input
            type="file"
            name="file"
            required
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </label>

        <p className="text-sm text-stone-500">
          Claude will extract the text so you can review and edit it on the
          next page.
        </p>

        <SubmitButton pendingLabel="Extracting…">
          Upload &amp; extract
        </SubmitButton>
        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
      </form>
    </div>
  );
}

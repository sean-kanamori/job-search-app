"use client";

import { useActionState } from "react";
import { createContact } from "@/app/(app)/applications/actions";
import { initialActionState } from "@/lib/action-state";

export function AddContactForm({ applicationId }: { applicationId: string }) {
  const action = createContact.bind(null, applicationId);
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <>
      <form
        action={formAction}
        className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-700">
            Name
          </span>
          <input
            name="name"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-700">
            Role
          </span>
          <select
            name="role"
            defaultValue="Recruiter"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="Recruiter">Recruiter</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="Interviewer">Interviewer</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-700">
            Phone
          </span>
          <input
            name="phone"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block flex-1 min-w-[160px]">
          <span className="mb-1 block text-xs font-medium text-gray-700">
            LinkedIn
          </span>
          <input
            type="url"
            name="linkedin_url"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add
        </button>
      </form>
      {state?.error && (
        <p className="-mt-2 mb-4 text-sm text-red-600">{state.error}</p>
      )}
    </>
  );
}

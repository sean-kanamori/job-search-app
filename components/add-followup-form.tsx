"use client";

import { useActionState } from "react";
import { createFollowup } from "@/app/(app)/applications/actions";
import { initialActionState } from "@/lib/action-state";
import type { Contact } from "@/lib/types";

export function AddFollowupForm({
  applicationId,
  contacts,
}: {
  applicationId: string;
  contacts: Contact[];
}) {
  const action = createFollowup.bind(null, applicationId);
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <>
      <form
        action={formAction}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-stone-200 bg-white p-4"
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-stone-700">
            Type
          </span>
          <select
            name="type"
            defaultValue="check-in"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="thank-you">Thank-you</option>
            <option value="check-in">Check-in</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-stone-700">
            Due date
          </span>
          <input
            type="date"
            name="due_date"
            required
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-stone-700">
            Contact
          </span>
          <select
            name="contact_id"
            defaultValue=""
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">No contact</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.role ? ` (${c.role})` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 min-w-[180px]">
          <span className="mb-1 block text-xs font-medium text-stone-700">
            Notes
          </span>
          <input
            name="notes"
            placeholder="Optional"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Add
        </button>
      </form>
      {state?.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
      {contacts.length === 0 && (
        <p className="mt-2 text-xs text-stone-400">
          Add a contact below to be able to tie a reminder to them.
        </p>
      )}
    </>
  );
}

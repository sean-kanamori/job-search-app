import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationEvent, Contact, Followup } from "@/lib/types";
import {
  createFollowup,
  completeFollowup,
  deleteFollowup,
  createContact,
  deleteContact,
} from "../../actions";

const FOLLOWUP_LABELS: Record<string, string> = {
  "thank-you": "Thank-you",
  "check-in": "Check-in",
  other: "Other",
};

function isOverdue(dueDate: string) {
  return dueDate < new Date().toISOString().slice(0, 10);
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("applications")
    .select("id")
    .eq("id", id)
    .single();
  if (!application) notFound();

  const [{ data: followupsData }, { data: contactsData }, { data: eventsData }] =
    await Promise.all([
      supabase
        .from("followups")
        .select("*")
        .eq("application_id", id)
        .eq("done", false)
        .order("due_date", { ascending: true }),
      supabase
        .from("contacts")
        .select("*")
        .eq("application_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("application_events")
        .select("*")
        .eq("application_id", id)
        .order("occurred_at", { ascending: false }),
    ]);

  const followups = (followupsData ?? []) as Followup[];
  const contacts = (contactsData ?? []) as Contact[];
  const events = (eventsData ?? []) as ApplicationEvent[];

  const createFollowupWithId = createFollowup.bind(null, id);
  const createContactWithId = createContact.bind(null, id);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Add a reminder
        </h2>
        <form
          action={createFollowupWithId}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4"
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-700">
              Type
            </span>
            <select
              name="type"
              defaultValue="check-in"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="thank-you">Thank-you</option>
              <option value="check-in">Check-in</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-700">
              Due date
            </span>
            <input
              type="date"
              name="due_date"
              required
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block flex-1 min-w-[180px]">
            <span className="mb-1 block text-xs font-medium text-gray-700">
              Notes
            </span>
            <input
              name="notes"
              placeholder="Optional"
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
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Pending follow-ups
        </h2>
        {followups.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nothing pending. Reminders you add, or that get suggested when
            status changes, show up here.
          </p>
        ) : (
          <ul className="space-y-2">
            {followups.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {FOLLOWUP_LABELS[f.type] ?? f.type}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isOverdue(f.due_date) ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      Due {f.due_date}
                      {isOverdue(f.due_date) ? " (overdue)" : ""}
                    </span>
                  </div>
                  {f.notes && (
                    <p className="mt-1 text-sm text-gray-600">{f.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <form action={completeFollowup.bind(null, f.id, id)}>
                    <button
                      type="submit"
                      className="text-sm text-green-700 hover:underline"
                    >
                      Mark done
                    </button>
                  </form>
                  <form action={deleteFollowup.bind(null, f.id, id)}>
                    <button
                      type="submit"
                      className="text-sm text-gray-400 hover:text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Contacts</h2>
        <form
          action={createContactWithId}
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
            <input
              name="role"
              placeholder="Recruiter, Hiring Manager…"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
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

        {contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No contacts added yet.</p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {c.name}
                    {c.role && (
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        {c.role}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-gray-600">
                    {c.email && <span>{c.email}</span>}
                    {c.phone && <span>{c.phone}</span>}
                    {c.linkedin_url && (
                      <a
                        href={c.linkedin_url}
                        className="text-gray-900 underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                <form action={deleteContact.bind(null, c.id, id)}>
                  <button
                    type="submit"
                    className="text-sm text-gray-400 hover:text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Activity log
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-2 border-t border-gray-100 pt-3">
            {events.map((e) => (
              <li key={e.id} className="text-sm text-gray-600">
                <span className="text-gray-400">
                  {formatDateTime(e.occurred_at)}
                </span>{" "}
                — {e.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

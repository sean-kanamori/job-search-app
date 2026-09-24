import type { ApplicationEvent, Contact, Followup } from "@/lib/types";

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

export function ActivityLists({
  applicationId,
  followups,
  contacts,
  events,
  readOnly = false,
  onCompleteFollowup,
  onDeleteFollowup,
  onDeleteContact,
  contactsFormSlot,
}: {
  applicationId: string;
  followups: Followup[];
  contacts: Contact[];
  events: ApplicationEvent[];
  readOnly?: boolean;
  onCompleteFollowup?: (followupId: string, applicationId: string) => Promise<void>;
  onDeleteFollowup?: (followupId: string, applicationId: string) => Promise<void>;
  onDeleteContact?: (contactId: string, applicationId: string) => Promise<void>;
  contactsFormSlot?: React.ReactNode;
}) {
  const contactsById = new Map(contacts.map((c) => [c.id, c]));

  return (
    <>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-900">
          Pending follow-ups
        </h2>
        {followups.length === 0 ? (
          <p className="text-sm text-stone-500">
            Nothing pending. Reminders you add, or that get suggested when
            status changes, show up here.
          </p>
        ) : (
          <ul className="space-y-2">
            {followups.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                      {FOLLOWUP_LABELS[f.type] ?? f.type}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isOverdue(f.due_date) ? "text-red-600" : "text-stone-900"
                      }`}
                    >
                      Due {f.due_date}
                      {isOverdue(f.due_date) ? " (overdue)" : ""}
                    </span>
                  </div>
                  {f.contact_id && contactsById.get(f.contact_id) && (
                    <p className="mt-1 text-sm text-stone-700">
                      {contactsById.get(f.contact_id)!.name}
                      {contactsById.get(f.contact_id)!.role
                        ? ` (${contactsById.get(f.contact_id)!.role})`
                        : ""}
                    </p>
                  )}
                  {f.notes && (
                    <p className="mt-1 text-sm text-stone-600">{f.notes}</p>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex items-center gap-3">
                    <form action={onCompleteFollowup?.bind(null, f.id, applicationId)}>
                      <button
                        type="submit"
                        className="text-sm text-green-700 hover:underline"
                      >
                        Mark done
                      </button>
                    </form>
                    <form action={onDeleteFollowup?.bind(null, f.id, applicationId)}>
                      <button
                        type="submit"
                        className="text-sm text-stone-400 hover:text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-900">Contacts</h2>
        {contactsFormSlot}
        {contacts.length === 0 ? (
          <p className="text-sm text-stone-500">No contacts added yet.</p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3"
              >
                <div>
                  <div className="text-sm font-medium text-stone-900">
                    {c.name}
                    {c.role && (
                      <span className="ml-2 text-xs font-normal text-stone-500">
                        {c.role}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-stone-600">
                    {c.email && <span>{c.email}</span>}
                    {c.phone && <span>{c.phone}</span>}
                    {c.linkedin_url && (
                      <a
                        href={c.linkedin_url}
                        className="text-stone-900 underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                {!readOnly && (
                  <form action={onDeleteContact?.bind(null, c.id, applicationId)}>
                    <button
                      type="submit"
                      className="text-sm text-stone-400 hover:text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-900">
          Activity log
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-stone-500">No activity yet.</p>
        ) : (
          <ul className="space-y-2 border-t border-stone-100 pt-3">
            {events.map((e) => (
              <li key={e.id} className="text-sm text-stone-600">
                <span className="text-stone-400">
                  {formatDateTime(e.occurred_at)}
                </span>{" "}
                — {e.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

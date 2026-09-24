import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationEvent, Contact, Followup } from "@/lib/types";
import { completeFollowup, deleteFollowup, deleteContact } from "../../actions";
import { AddFollowupForm } from "@/components/add-followup-form";
import { AddContactForm } from "@/components/add-contact-form";
import { ActivityLists } from "@/components/activity-lists";

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

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-900">
          Add a reminder
        </h2>
        <AddFollowupForm applicationId={id} contacts={contacts} />
      </section>

      <ActivityLists
        applicationId={id}
        followups={followups}
        contacts={contacts}
        events={events}
        onCompleteFollowup={completeFollowup}
        onDeleteFollowup={deleteFollowup}
        onDeleteContact={deleteContact}
        contactsFormSlot={<AddContactForm applicationId={id} />}
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import { ActivityLists } from "@/components/activity-lists";
import {
  getShowcaseApplication,
  showcaseContacts,
  showcaseEvents,
  showcaseFollowups,
} from "@/lib/showcase-data";

export default async function ShowcaseActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = getShowcaseApplication(id);
  if (!application) notFound();

  const followups = showcaseFollowups.filter((f) => f.application_id === id);
  const contacts = showcaseContacts.filter((c) => c.application_id === id);
  const events = showcaseEvents.filter((e) => e.application_id === id);

  return (
    <div className="space-y-8">
      <ActivityLists
        applicationId={id}
        followups={followups}
        contacts={contacts}
        events={events}
        readOnly
      />
    </div>
  );
}

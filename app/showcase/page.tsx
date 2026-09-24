import { ApplicationsView } from "@/components/applications-view";
import { showcaseApplications, showcaseFollowups } from "@/lib/showcase-data";
import type { ApplicationStatus } from "@/lib/types";

export default async function ShowcaseHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; reminder?: string }>;
}) {
  const { status, q, reminder } = await searchParams;

  const today = new Date().toISOString().slice(0, 10);
  const overdueAppIds = new Set<string>();
  const pendingAppIds = new Set<string>();
  for (const f of showcaseFollowups) {
    pendingAppIds.add(f.application_id);
    if (f.due_date < today) overdueAppIds.add(f.application_id);
  }

  const selectedStatuses = (status ?? "")
    .split(",")
    .filter(Boolean) as ApplicationStatus[];
  const searchQuery = (q ?? "").trim().toLowerCase();
  const reminderOnly = reminder === "1";

  const applications = showcaseApplications.filter((app) => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(app.status)) {
      return false;
    }
    if (searchQuery && !app.company.toLowerCase().includes(searchQuery)) {
      return false;
    }
    if (reminderOnly && !pendingAppIds.has(app.id)) {
      return false;
    }
    return true;
  });

  return (
    <ApplicationsView
      applications={applications}
      totalCount={showcaseApplications.length}
      pendingAppIds={pendingAppIds}
      overdueAppIds={overdueAppIds}
      addHref={null}
      linkBase="/showcase/applications"
    />
  );
}

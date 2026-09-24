import { createClient } from "@/lib/supabase/server";
import { ApplicationsView } from "@/components/applications-view";
import type { Application, ApplicationStatus } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; reminder?: string }>;
}) {
  const { status, q, reminder } = await searchParams;
  const supabase = await createClient();

  const [{ data: applicationsData, error }, { data: followupsData }] =
    await Promise.all([
      supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("followups").select("application_id, due_date").eq("done", false),
    ]);

  const today = new Date().toISOString().slice(0, 10);
  const overdueAppIds = new Set<string>();
  const pendingAppIds = new Set<string>();
  for (const f of followupsData ?? []) {
    pendingAppIds.add(f.application_id);
    if (f.due_date < today) overdueAppIds.add(f.application_id);
  }

  const selectedStatuses = (status ?? "")
    .split(",")
    .filter(Boolean) as ApplicationStatus[];
  const searchQuery = (q ?? "").trim().toLowerCase();
  const reminderOnly = reminder === "1";

  const allApplications = (applicationsData ?? []) as Application[];
  const applications = allApplications.filter((app) => {
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
    <>
      {error && (
        <p className="mb-4 text-sm text-red-600">
          Couldn&apos;t load applications: {error.message}
        </p>
      )}
      <ApplicationsView
        applications={applications}
        totalCount={allApplications.length}
        pendingAppIds={pendingAppIds}
        overdueAppIds={overdueAppIds}
        addHref="/applications/new"
        linkBase="/applications"
      />
    </>
  );
}

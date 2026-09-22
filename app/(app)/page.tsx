import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { ReminderBadge } from "@/components/reminder-badge";
import { ApplicationsFilterBar } from "@/components/applications-filter-bar";
import type { Application, ApplicationStatus } from "@/lib/types";

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "—";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  return fmt(min ?? max ?? 0);
}

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

  const applications = ((applicationsData ?? []) as Application[]).filter(
    (app) => {
      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(app.status)
      ) {
        return false;
      }
      if (searchQuery && !app.company.toLowerCase().includes(searchQuery)) {
        return false;
      }
      if (reminderOnly && !pendingAppIds.has(app.id)) {
        return false;
      }
      return true;
    }
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Applications</h1>
        <Link
          href="/applications/new"
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          + Add application
        </Link>
      </div>

      <ApplicationsFilterBar />

      {error && (
        <p className="mb-4 text-sm text-red-600">
          Couldn&apos;t load applications: {error.message}
        </p>
      )}

      {applications.length === 0 ? (
        <p className="text-sm text-stone-500">
          {applicationsData && applicationsData.length > 0
            ? "No applications match these filters."
            : "Nothing here yet — add your first application and I'll help you keep track from here."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-stone-500">
                  Company
                </th>
                <th className="px-4 py-2 text-left font-medium text-stone-500">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-stone-500">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-stone-500">
                  Salary (USD)
                </th>
                <th className="px-4 py-2 text-left font-medium text-stone-500">
                  Applied
                </th>
                <th className="px-4 py-2 text-left font-medium text-stone-500">
                  Reminder
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2">
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {app.company}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-stone-700">{app.title}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-2 text-stone-700">
                    {formatSalary(app.salary_min, app.salary_max)}
                  </td>
                  <td className="px-4 py-2 text-stone-700">
                    {app.applied_date ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    {pendingAppIds.has(app.id) && (
                      <ReminderBadge overdue={overdueAppIds.has(app.id)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

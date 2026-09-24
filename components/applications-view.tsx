import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/status-badge";
import { ReminderBadge } from "@/components/reminder-badge";
import { ApplicationsFilterBar } from "@/components/applications-filter-bar";
import type { Application } from "@/lib/types";

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "—";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  return fmt(min ?? max ?? 0);
}

export function ApplicationsView({
  applications,
  totalCount,
  pendingAppIds,
  overdueAppIds,
  addHref,
  linkBase,
}: {
  applications: Application[];
  totalCount: number;
  pendingAppIds: Set<string>;
  overdueAppIds: Set<string>;
  addHref: string | null;
  linkBase: string;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Applications</h1>
        {addHref && (
          <Link
            href={addHref}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            + Add application
          </Link>
        )}
      </div>

      <ApplicationsFilterBar />

      {applications.length === 0 ? (
        totalCount > 0 ? (
          <p className="text-sm text-stone-500">
            No applications match these filters.
          </p>
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <Image
              src="/mascot.png"
              alt=""
              width={100}
              height={100}
              aria-hidden="true"
            />
            <p className="mt-2 text-sm text-stone-500">
              Nothing here yet — add your first application and I&apos;ll
              help you keep track from here.
            </p>
          </div>
        )
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
                      href={`${linkBase}/${app.id}`}
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

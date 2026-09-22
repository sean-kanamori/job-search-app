import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import type { Application } from "@/lib/types";

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "—";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  return fmt(min ?? max ?? 0);
}

export default async function Home() {
  const supabase = await createClient();
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
        <Link
          href="/applications/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add application
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          Couldn&apos;t load applications: {error.message}
        </p>
      )}

      {!applications || applications.length === 0 ? (
        <p className="text-sm text-gray-500">
          No applications yet. Add your first one to get started.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Company
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Salary (USD)
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(applications as Application[]).map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {app.company}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-700">{app.title}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {formatSalary(app.salary_min, app.salary_max)}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {app.applied_date ?? "—"}
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

import { StatusBadge } from "@/components/status-badge";
import type { Application } from "@/lib/types";

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "—";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  return fmt(min ?? max ?? 0);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-stone-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-stone-900">{children}</div>
    </div>
  );
}

export function ApplicationReadonly({
  application,
  resumeName,
}: {
  application: Application;
  resumeName: string | null;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company">{application.company}</Field>
        <Field label="Title">{application.title}</Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Status">
          <StatusBadge status={application.status} />
        </Field>
        <Field label="Applied date">{application.applied_date ?? "—"}</Field>
        <Field label="Resume used">{resumeName ?? "None selected"}</Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Source">
          {application.source ?? "—"}
          {application.referral_name ? ` — ${application.referral_name}` : ""}
        </Field>
        <Field label="Location">
          {application.location ?? "—"}
          {application.remote &&
          !application.location?.toLowerCase().includes("remote")
            ? " (Remote)"
            : ""}
        </Field>
        <Field label="Salary (USD)">
          {formatSalary(application.salary_min, application.salary_max)}
        </Field>
      </div>

      {application.job_url && (
        <Field label="Job URL">
          <a
            href={application.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            {application.job_url}
          </a>
        </Field>
      )}

      {application.job_description && (
        <Field label="Job description">
          <p className="whitespace-pre-wrap">{application.job_description}</p>
        </Field>
      )}

      {application.notes && (
        <Field label="Notes">
          <p className="whitespace-pre-wrap">{application.notes}</p>
        </Field>
      )}
    </div>
  );
}

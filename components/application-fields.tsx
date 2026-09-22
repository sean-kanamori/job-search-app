import type { Application } from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export function ApplicationFields({
  defaultValues = {},
}: {
  defaultValues?: Partial<Application>;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Company *</span>
          <input
            name="company"
            required
            defaultValue={defaultValues.company ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Title *</span>
          <input
            name="title"
            required
            defaultValue={defaultValues.title ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Status</span>
          <select
            name="status"
            defaultValue={defaultValues.status ?? "saved"}
            className={inputClass}
          >
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Applied date</span>
          <input
            type="date"
            name="applied_date"
            defaultValue={defaultValues.applied_date ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Source</span>
          <input
            name="source"
            placeholder="LinkedIn, referral…"
            defaultValue={defaultValues.source ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Location</span>
          <input
            name="location"
            defaultValue={defaultValues.location ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Salary min</span>
          <input
            type="number"
            name="salary_min"
            defaultValue={defaultValues.salary_min ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Salary max</span>
          <input
            type="number"
            name="salary_max"
            defaultValue={defaultValues.salary_max ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="remote"
          defaultChecked={!!defaultValues.remote}
          className="rounded border-gray-300"
        />
        Remote
      </label>

      <label className="block">
        <span className={labelClass}>Job URL</span>
        <input
          type="url"
          name="job_url"
          defaultValue={defaultValues.job_url ?? ""}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Job description</span>
        <textarea
          name="job_description"
          rows={4}
          defaultValue={defaultValues.job_description ?? ""}
          placeholder="Paste it here — useful later for tailoring your resume"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Notes</span>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaultValues.notes ?? ""}
          className={inputClass}
        />
      </label>
    </>
  );
}

"use client";

import { useState } from "react";
import type { Application, ApplicationStatus } from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const SOURCE_OPTIONS = [
  "LinkedIn",
  "Company website",
  "Other job board",
  "Referral",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ApplicationFields({
  defaultValues = {},
  resumeTemplates = [],
}: {
  defaultValues?: Partial<Application>;
  resumeTemplates?: { id: string; name: string }[];
}) {
  const [status, setStatus] = useState(defaultValues.status ?? "saved");
  const [appliedDate, setAppliedDate] = useState(
    defaultValues.applied_date ?? ""
  );
  const [source, setSource] = useState(defaultValues.source ?? "");

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ApplicationStatus;
    setStatus(next);
    // Auto-fill today's date the first time status moves to "applied" —
    // never overwrites a date you've already set.
    if (next === "applied" && !appliedDate) {
      setAppliedDate(today());
    }
  }

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
            value={status}
            onChange={handleStatusChange}
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
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Resume used</span>
          <select
            name="resume_template_id"
            defaultValue={defaultValues.resume_template_id ?? ""}
            className={inputClass}
          >
            <option value="">None selected</option>
            {resumeTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Source</span>
          <select
            name="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={inputClass}
          >
            <option value="">Select source</option>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        {source === "Referral" && (
          <label className="block">
            <span className={labelClass}>Referral name</span>
            <input
              name="referral_name"
              defaultValue={defaultValues.referral_name ?? ""}
              className={inputClass}
            />
          </label>
        )}
        <label className="block">
          <span className={labelClass}>Location</span>
          <input
            name="location"
            defaultValue={defaultValues.location ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Salary min (USD)</span>
          <input
            type="number"
            name="salary_min"
            defaultValue={defaultValues.salary_min ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Salary max (USD)</span>
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

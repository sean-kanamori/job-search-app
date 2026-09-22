"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export function ApplicationsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedStatuses = (searchParams.get("status") ?? "")
    .split(",")
    .filter(Boolean);
  const reminderOnly = searchParams.get("reminder") === "1";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Debounce the search box so we're not pushing a URL update per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ q: query || null });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function updateParams(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function toggleStatus(status: ApplicationStatus) {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    updateParams({ status: next.length > 0 ? next.join(",") : null });
  }

  function toggleReminderOnly() {
    updateParams({ reminder: reminderOnly ? null : "1" });
  }

  const hasFilters =
    selectedStatuses.length > 0 || reminderOnly || query.length > 0;

  return (
    <div className="mb-4 space-y-3 rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company…"
          className="w-full max-w-xs rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={reminderOnly}
            onChange={toggleReminderOnly}
            className="rounded border-stone-300"
          />
          Pending reminder only
        </label>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              router.replace(pathname);
            }}
            className="text-sm text-stone-500 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const active = selectedStatuses.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleStatus(opt.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                active
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

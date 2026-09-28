"use client";

import { useState, useTransition } from "react";
import { parseJobUrl } from "@/app/(app)/applications/parse-job-url";
import type { ParsedJobPosting } from "@/lib/anthropic";

export function JobUrlParser({
  onParsed,
}: {
  onParsed: (
    data: ParsedJobPosting & { job_url: string; source: string | null }
  ) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleParse() {
    setError("");
    if (!url.trim()) {
      setError("Paste a job URL first.");
      return;
    }
    startTransition(async () => {
      const result = await parseJobUrl(url.trim());
      if ("error" in result) {
        setError(result.error);
      } else {
        onParsed({ ...result.data, job_url: url.trim() });
      }
    });
  }

  return (
    <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-700">
          Job URL (optional)
        </span>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleParse}
            disabled={isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {isPending ? "Reading…" : "Fill in from URL"}
          </button>
        </div>
      </label>
      <p className="mt-2 text-xs text-stone-400">
        Works best on company career pages and ATS platforms like Greenhouse
        or Lever. LinkedIn and Indeed often block this — paste the details in
        manually if it doesn&apos;t work.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

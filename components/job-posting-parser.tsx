"use client";

import { useState, useTransition } from "react";
import {
  parseJobUrl,
  parseJobText,
} from "@/app/(app)/applications/parse-job-posting";
import type { ParsedJobPosting } from "@/lib/anthropic";

type ParsedData = ParsedJobPosting & { job_url: string; source: string | null };

export function JobPostingParser({
  onParsed,
}: {
  onParsed: (data: ParsedData) => void;
}) {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleParse() {
    setError("");
    if (mode === "url") {
      if (!url.trim()) {
        setError("Paste a job URL first.");
        return;
      }
      startTransition(async () => {
        const result = await parseJobUrl(url.trim());
        if ("error" in result) setError(result.error);
        else onParsed(result.data);
      });
    } else {
      if (!text.trim()) {
        setError("Paste the job description first.");
        return;
      }
      startTransition(async () => {
        const result = await parseJobText(text.trim());
        if ("error" in result) setError(result.error);
        else onParsed(result.data);
      });
    }
  }

  function switchMode(next: "url" | "text") {
    setMode(next);
    setError("");
  }

  return (
    <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4">
      <div className="mb-3 flex gap-1 rounded-lg bg-stone-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => switchMode("url")}
          className={`flex-1 rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === "url"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Paste URL
        </button>
        <button
          type="button"
          onClick={() => switchMode("text")}
          className={`flex-1 rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === "text"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Paste text
        </button>
      </div>

      {mode === "url" ? (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">
            Job URL
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
          <p className="mt-2 text-xs text-stone-400">
            Works best on company career pages and ATS platforms like
            Greenhouse or Lever. LinkedIn and Indeed often block this — switch
            to &quot;Paste text&quot; if it doesn&apos;t work.
          </p>
        </label>
      ) : (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">
            Job description
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Paste the full job posting text here…"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-stone-400">
              Copy the job description from the page (works for LinkedIn,
              Indeed, or anywhere else) and paste it here.
            </p>
            <button
              type="button"
              onClick={handleParse}
              disabled={isPending}
              className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {isPending ? "Parsing…" : "Fill in from text"}
            </button>
          </div>
        </label>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

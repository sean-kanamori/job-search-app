"use client";

import { useState, useTransition } from "react";
import { tailorResume } from "@/app/(app)/applications/tailor-resume";
import type { TailoringSuggestions } from "@/lib/anthropic";

const MIN_JOB_DESCRIPTION_LENGTH = 100;

export function ResumeTailoring({
  resumeTemplateId,
  jobDescription,
}: {
  resumeTemplateId: string;
  jobDescription: string;
}) {
  const [suggestions, setSuggestions] = useState<TailoringSuggestions | null>(
    null
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const hasEnoughText = jobDescription.trim().length >= MIN_JOB_DESCRIPTION_LENGTH;

  function handleClick() {
    setError("");
    startTransition(async () => {
      const result = await tailorResume(resumeTemplateId, jobDescription);
      if ("error" in result) setError(result.error);
      else setSuggestions(result.data);
    });
  }

  function legacyCopy(text: string): boolean {
    // Fallback for contexts where the async Clipboard API is blocked
    // (denied permission, insecure context, some embedded browsers).
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    document.body.removeChild(textarea);
    return copied;
  }

  async function handleCopy(text: string, index: number) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = legacyCopy(text);
    }
    if (copied) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((i) => (i === index ? null : i)), 1500);
    } else {
      setError("Couldn't copy automatically — select and copy the text manually.");
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-700">
            Tailor this resume to the job
          </p>
          <p className="mt-0.5 text-xs text-stone-400">
            {hasEnoughText
              ? "Compares your resume against the job description above and suggests specific changes."
              : "Add more of the job description above to get tailoring suggestions."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={!hasEnoughText || isPending}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending
            ? "Analyzing…"
            : suggestions
              ? "Refresh suggestions"
              : "Get tailoring suggestions"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {suggestions && (
        <div className="mt-4 space-y-4 border-t border-stone-100 pt-4">
          <p className="text-sm text-stone-700">{suggestions.overall_fit}</p>

          {suggestions.strong_matches.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
                Already a good fit
              </p>
              <ul className="space-y-1">
                {suggestions.strong_matches.map((match, i) => (
                  <li key={i} className="flex gap-2 text-sm text-stone-700">
                    <span className="text-emerald-600">✓</span>
                    <span>{match}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.missing_keywords.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
                Worth adding if genuinely true
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.missing_keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestions.bullet_suggestions.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
                Suggested rewrites
              </p>
              <div className="space-y-3">
                {suggestions.bullet_suggestions.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-stone-200 bg-stone-50 p-3"
                  >
                    <p className="text-xs text-stone-400">
                      Currently: <span className="text-stone-500">{b.original}</span>
                    </p>
                    <p className="mt-1.5 text-sm text-stone-800">{b.suggestion}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="text-xs italic text-stone-400">{b.reason}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(b.suggestion, i)}
                        className="shrink-0 text-xs font-medium text-accent hover:underline"
                      >
                        {copiedIndex === i ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-stone-400">
            These are suggestions only — your saved resume isn&apos;t changed.
            Copy anything useful into a new resume version if you&apos;d like
            to use it.
          </p>
        </div>
      )}
    </div>
  );
}

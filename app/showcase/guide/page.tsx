"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GUIDE_STEPS } from "@/lib/guide-steps";

export default function ShowcaseGuidePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isFirst = step === 0;
  const isLast = step === GUIDE_STEPS.length - 1;
  const current = GUIDE_STEPS[step];

  function finish() {
    router.push("/showcase");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-8 text-center">
      <Image
        key={current.image + step}
        src={current.image}
        alt=""
        width={140}
        height={140}
        priority
        aria-hidden="true"
      />
      <h1 className="mt-4 text-xl font-semibold text-stone-900">
        {current.headline}
      </h1>
      <p className="mt-2 max-w-md text-sm text-stone-600">{current.body}</p>

      {current.screenshot && (
        <Image
          key={current.screenshot.src}
          src={current.screenshot.src}
          alt=""
          width={current.screenshot.width}
          height={current.screenshot.height}
          className="mt-5 h-auto w-full max-w-md rounded-lg border border-stone-200 shadow-sm"
          aria-hidden="true"
        />
      )}

      <div className="mt-6 flex gap-2">
        {GUIDE_STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === step ? "bg-accent" : "bg-stone-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex w-full max-w-md items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={isFirst}
          className="text-sm text-stone-500 hover:text-stone-900 disabled:opacity-0"
        >
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={finish}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Get started
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(GUIDE_STEPS.length - 1, s + 1))}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Next
          </button>
        )}
      </div>

      {!isLast && (
        <button
          type="button"
          onClick={finish}
          className="mt-4 text-xs text-stone-400 hover:text-stone-600 hover:underline"
        >
          Skip
        </button>
      )}

      {isLast && (
        <p className="mt-4 text-sm text-stone-500">
          Or, want the real thing?{" "}
          <Link href="/login" className="font-medium text-accent underline">
            Ask me for an invite →
          </Link>
        </p>
      )}
    </div>
  );
}

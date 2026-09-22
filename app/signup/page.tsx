"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SubmitButton } from "@/components/submit-button";
import { signUp, type SignUpState } from "./actions";

const initialState: SignUpState = {};

export default function SignupPage() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
      <Image
        src="/mascot.png"
        alt=""
        width={120}
        height={120}
        className="mb-2"
        aria-hidden="true"
        priority
      />
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-semibold text-stone-900">
          Cora
        </h1>
        <p className="mb-6 text-center text-sm text-stone-500">
          Let&apos;s get you set up — you&apos;ll need an invite code.
        </p>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">
              Invite code
            </span>
            <input
              name="invite_code"
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>
          <SubmitButton
            pendingLabel="Creating account…"
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            Create account
          </SubmitButton>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-stone-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

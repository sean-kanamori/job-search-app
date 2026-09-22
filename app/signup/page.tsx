"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { signUp, type SignUpState } from "./actions";

const initialState: SignUpState = {};

export default function SignupPage() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-gray-900">
          Job Search
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Create an account — you&apos;ll need an invite code.
        </p>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Invite code
            </span>
            <input
              name="invite_code"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </label>
          <SubmitButton
            pendingLabel="Creating account…"
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Create account
          </SubmitButton>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

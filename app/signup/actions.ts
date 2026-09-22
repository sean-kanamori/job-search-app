"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { createClient } from "@/lib/supabase/server";

export type SignUpState = { error?: string };

export async function signUp(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = ((formData.get("email") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";
  const inviteCode = ((formData.get("invite_code") as string) ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Checked server-side, not in the browser — the Supabase anon key is
  // always public, so a client-only check wouldn't actually stop
  // someone from calling the sign-up API directly.
  if (!process.env.INVITE_CODE || inviteCode !== process.env.INVITE_CODE) {
    return { error: "Invalid invite code." };
  }

  const admin = createAdminClient();
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // no confirmation email needed
  });

  if (createError) {
    if (createError.message.toLowerCase().includes("already been registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: createError.message };
  }

  // Sign them in immediately via the regular (cookie-aware) server
  // client, so they land in the app already authenticated.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) return { error: signInError.message };

  redirect("/");
}

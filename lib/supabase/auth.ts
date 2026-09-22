import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Call at the top of a protected Server Component or layout.
 * Redirects to /login if there's no signed-in user; otherwise
 * returns the user so the page can use it.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

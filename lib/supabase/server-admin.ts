import { createClient } from "@supabase/supabase-js";

/**
 * Admin client using the service_role key — BYPASSES Row-Level Security.
 * Server-side only. Never import this into a Client Component or
 * expose it via an API route without your own auth check first.
 * Reserved for background jobs / admin tasks; day-to-day reads and
 * writes should go through lib/supabase/server.ts instead so RLS
 * stays the thing enforcing per-user isolation.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

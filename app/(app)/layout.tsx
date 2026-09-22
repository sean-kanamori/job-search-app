import Link from "next/link";
import { requireUser } from "@/lib/supabase/auth";
import { signOut } from "./applications/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Job Search
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-gray-600 underline hover:text-gray-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

import Link from "next/link";
import { requireUser } from "@/lib/supabase/auth";
import { TabNav } from "@/components/tab-nav";
import { Logo } from "@/components/logo";
import { signOut } from "./applications/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-stone-900"
            title="Cora — Career Organizer & Reminder Assistant"
          >
            <Logo size="sm" />
            Cora
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <span>{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-stone-600 underline hover:text-stone-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6">
          <TabNav
            tabs={[
              { href: "/", label: "Applications" },
              { href: "/resumes", label: "Resumes" },
              { href: "/guide", label: "How to use" },
            ]}
          />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

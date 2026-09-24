import Link from "next/link";
import { Logo } from "@/components/logo";
import { TabNav } from "@/components/tab-nav";

// Public, unauthenticated, read-only. Never touches Supabase or any
// server action — every showcase page renders from static fixture
// data in lib/showcase-data.ts.
export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-accent/20 bg-accent/5 px-6 py-2 text-center text-sm text-stone-700">
        You&apos;re viewing a read-only demo with sample data —{" "}
        <Link href="/login" className="font-medium text-accent underline">
          Want to try the real thing for yourself? Ask me for an invite →
        </Link>
      </div>
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-4">
          <Link
            href="/showcase"
            className="flex items-center gap-2 text-lg font-semibold text-stone-900"
            title="Cora — Career Organizer & Reminder Assistant"
          >
            <Logo size="sm" />
            Cora
          </Link>
          <span className="text-sm text-stone-400">Demo</span>
        </div>
        <div className="mx-auto max-w-5xl px-6">
          <TabNav
            tabs={[
              { href: "/showcase", label: "Applications" },
              { href: "/showcase/resumes", label: "Resumes" },
              { href: "/showcase/guide", label: "How to use" },
            ]}
          />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

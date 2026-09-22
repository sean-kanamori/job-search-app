import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TabNav } from "@/components/tab-nav";

export default async function ApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: application } = await supabase
    .from("applications")
    .select("company, title")
    .eq("id", id)
    .single();

  if (!application) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">
            {application.title} · {application.company}
          </h1>
        </div>
        <Link href="/" className="text-sm text-stone-500 hover:underline">
          Back to applications
        </Link>
      </div>

      <TabNav
        tabs={[
          { href: `/applications/${id}`, label: "Details" },
          { href: `/applications/${id}/activity`, label: "Activity" },
        ]}
      />

      {children}
    </div>
  );
}

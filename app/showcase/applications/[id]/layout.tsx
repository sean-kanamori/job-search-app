import Link from "next/link";
import { notFound } from "next/navigation";
import { getShowcaseApplication, showcaseApplications } from "@/lib/showcase-data";
import { TabNav } from "@/components/tab-nav";

export function generateStaticParams() {
  return showcaseApplications.map((a) => ({ id: a.id }));
}

export default async function ShowcaseApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = getShowcaseApplication(id);
  if (!application) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">
          {application.title} · {application.company}
        </h1>
        <Link href="/showcase" className="text-sm text-stone-500 hover:underline">
          Back to applications
        </Link>
      </div>

      <TabNav
        tabs={[
          { href: `/showcase/applications/${id}`, label: "Details" },
          { href: `/showcase/applications/${id}/activity`, label: "Activity" },
        ]}
      />

      {children}
    </div>
  );
}

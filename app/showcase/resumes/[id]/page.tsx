import Link from "next/link";
import { notFound } from "next/navigation";
import { getShowcaseResume, showcaseResumes } from "@/lib/showcase-data";

export function generateStaticParams() {
  return showcaseResumes.map((r) => ({ id: r.id }));
}

export default async function ShowcaseResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = getShowcaseResume(id);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">
          {template.name}
        </h1>
        <Link
          href="/showcase/resumes"
          className="text-sm text-stone-500 hover:underline"
        >
          Back to resumes
        </Link>
      </div>

      {template.original_file_name && (
        <p className="mb-4 text-sm text-stone-500">
          Original file: {template.original_file_name}
        </p>
      )}

      <div className="whitespace-pre-wrap rounded-xl border border-stone-200 bg-white p-6 font-mono text-sm text-stone-800">
        {template.content}
      </div>
    </div>
  );
}

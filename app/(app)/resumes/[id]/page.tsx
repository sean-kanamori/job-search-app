import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeEditForm } from "@/components/resume-edit-form";
import type { ResumeTemplate } from "@/lib/types";
import { deleteResumeTemplate } from "../actions";

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("resume_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const template = data as ResumeTemplate;

  let originalFileUrl: string | null = null;
  if (template.original_file_path) {
    const { data: signed } = await supabase.storage
      .from("resumes")
      .createSignedUrl(template.original_file_path, 300);
    originalFileUrl = signed?.signedUrl ?? null;
  }

  const deleteWithId = deleteResumeTemplate.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          Edit resume template
        </h1>
        <Link href="/resumes" className="text-sm text-gray-500 hover:underline">
          Back to resumes
        </Link>
      </div>

      <ResumeEditForm template={template} originalFileUrl={originalFileUrl} />

      <form action={deleteWithId} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete this template
        </button>
      </form>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import type { ResumeTemplate } from "@/lib/types";
import { updateResumeTemplate, deleteResumeTemplate } from "../actions";

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

  const updateWithId = updateResumeTemplate.bind(null, id);
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

      <form action={updateWithId} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </span>
          <input
            name="name"
            required
            defaultValue={template.name}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Content
          </span>
          <textarea
            name="content"
            rows={22}
            defaultValue={template.content}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-gray-500 focus:outline-none"
          />
        </label>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm text-gray-700">
            {template.original_file_name ? (
              <>
                Original file:{" "}
                {originalFileUrl ? (
                  <a
                    href={originalFileUrl}
                    className="text-gray-900 underline"
                  >
                    {template.original_file_name}
                  </a>
                ) : (
                  template.original_file_name
                )}
              </>
            ) : (
              "No original file on record."
            )}
          </p>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Replace file (re-extracts and overwrites content above)
            </span>
            <input
              type="file"
              name="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </form>

      <form action={deleteWithId} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete this template
        </button>
      </form>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { ResumesView } from "@/components/resumes-view";
import type { ResumeTemplate } from "@/lib/types";

export default async function ResumesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume_templates")
    .select("*")
    .order("updated_at", { ascending: false });

  const templates = (data ?? []) as ResumeTemplate[];

  return (
    <>
      {error && (
        <p className="mb-4 text-sm text-red-600">
          Couldn&apos;t load templates: {error.message}
        </p>
      )}
      <ResumesView
        templates={templates}
        uploadHref="/resumes/new"
        linkBase="/resumes"
      />
    </>
  );
}

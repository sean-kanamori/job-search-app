import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationForm } from "@/components/application-form";
import { updateApplication, deleteApplication } from "../actions";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: application }, { data: resumeTemplates }] = await Promise.all([
    supabase.from("applications").select("*").eq("id", id).single(),
    supabase
      .from("resume_templates")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (!application) notFound();

  const updateWithId = updateApplication.bind(null, id);
  const deleteWithId = deleteApplication.bind(null, id);

  return (
    <div>
      <ApplicationForm
        action={updateWithId}
        defaultValues={application}
        resumeTemplates={resumeTemplates ?? []}
        submitLabel="Save changes"
      />

      <form action={deleteWithId} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete application
        </button>
      </form>
    </div>
  );
}

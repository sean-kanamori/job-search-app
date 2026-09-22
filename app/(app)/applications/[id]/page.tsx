import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationFields } from "@/components/application-fields";
import { updateApplication, deleteApplication } from "../actions";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!application) notFound();

  const updateWithId = updateApplication.bind(null, id);
  const deleteWithId = deleteApplication.bind(null, id);

  return (
    <div>
      <form action={updateWithId} className="space-y-4">
        <ApplicationFields defaultValues={application} />
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Save changes
        </button>
      </form>

      <form action={deleteWithId} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete application
        </button>
      </form>
    </div>
  );
}

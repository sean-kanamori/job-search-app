import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ApplicationFields } from "@/components/application-fields";
import { createApplication } from "../actions";

export default async function NewApplicationPage() {
  const supabase = await createClient();
  const { data: resumeTemplates } = await supabase
    .from("resume_templates")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          Add application
        </h1>
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          Cancel
        </Link>
      </div>
      <form action={createApplication} className="space-y-4">
        <ApplicationFields resumeTemplates={resumeTemplates ?? []} />
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add application
        </button>
      </form>
    </div>
  );
}

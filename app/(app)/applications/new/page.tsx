import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ApplicationForm } from "@/components/application-form";
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
        <h1 className="text-xl font-semibold text-stone-900">
          Add application
        </h1>
        <Link href="/" className="text-sm text-stone-500 hover:underline">
          Cancel
        </Link>
      </div>
      <ApplicationForm
        action={createApplication}
        resumeTemplates={resumeTemplates ?? []}
        submitLabel="Add application"
      />
    </div>
  );
}

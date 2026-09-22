import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { ResumeTemplate } from "@/lib/types";

export default async function ResumesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume_templates")
    .select("*")
    .order("updated_at", { ascending: false });

  const templates = (data ?? []) as ResumeTemplate[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">
          Resume templates
        </h1>
        <Link
          href="/resumes/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          + Upload resume
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          Couldn&apos;t load templates: {error.message}
        </p>
      )}

      {templates.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Image src="/mascot.png" alt="" width={100} height={100} aria-hidden="true" />
          <p className="mt-2 text-sm text-stone-500">
            No resumes yet. Upload a PDF or DOCX to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {templates.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50"
            >
              <Link href={`/resumes/${t.id}`} className="block">
                <div className="font-medium text-stone-900">{t.name}</div>
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                  {t.content || "No extracted text yet."}
                </p>
                <div className="mt-2 text-xs text-stone-400">
                  Updated {new Date(t.updated_at).toLocaleDateString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

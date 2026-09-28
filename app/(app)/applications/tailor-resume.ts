"use server";

import { createClient } from "@/lib/supabase/server";
import {
  suggestResumeTailoring,
  type TailoringSuggestions,
} from "@/lib/anthropic";

export type TailorResumeResult =
  | { data: TailoringSuggestions }
  | { error: string };

export async function tailorResume(
  resumeTemplateId: string,
  jobDescription: string
): Promise<TailorResumeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  if (!resumeTemplateId) return { error: "Select a resume first." };

  const trimmed = jobDescription.trim();
  if (trimmed.length < 100) {
    return {
      error:
        "Add more of the job description first — there's not enough here to compare against.",
    };
  }

  // RLS scopes this to the signed-in user's own resumes.
  const { data: resume, error: resumeError } = await supabase
    .from("resume_templates")
    .select("content")
    .eq("id", resumeTemplateId)
    .single();
  if (resumeError || !resume) {
    return { error: "Couldn't find that resume." };
  }

  try {
    const data = await suggestResumeTailoring(
      resume.content.slice(0, 20000),
      trimmed.slice(0, 15000)
    );
    return { data };
  } catch {
    return { error: "Couldn't generate suggestions. Try again in a moment." };
  }
}

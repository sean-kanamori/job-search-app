"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractResumeTextFromPdf, cleanupResumeText } from "@/lib/anthropic";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function extractText(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("File is too large (10MB max).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    return extractResumeTextFromPdf(buffer.toString("base64"));
  }

  if (file.type === DOCX_MIME) {
    const mammoth = await import("mammoth");
    const { value: rawText } = await mammoth.extractRawText({ buffer });
    return cleanupResumeText(rawText);
  }

  throw new Error("Only PDF and DOCX files are supported.");
}

async function uploadOriginal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
) {
  const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from("resumes")
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return path;
}

export async function uploadResumeTemplate(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = ((formData.get("name") as string) ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!name) throw new Error("Name is required.");
  if (!file || file.size === 0) throw new Error("A file is required.");

  const content = await extractText(file);
  const filePath = await uploadOriginal(supabase, user.id, file);

  const { data: inserted, error } = await supabase
    .from("resume_templates")
    .insert({
      user_id: user.id,
      name,
      content,
      original_file_path: filePath,
      original_file_name: file.name,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/resumes");
  redirect(`/resumes/${inserted.id}`);
}

export async function updateResumeTemplate(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = ((formData.get("name") as string) ?? "").trim();
  const content = (formData.get("content") as string) ?? "";
  const file = formData.get("file") as File | null;

  if (!name) throw new Error("Name is required.");

  const updates: {
    name: string;
    content: string;
    original_file_path?: string;
    original_file_name?: string;
  } = { name, content };

  // Replacing the file re-extracts text and overwrites the content
  // field, discarding any manual edits made since the last upload.
  if (file && file.size > 0) {
    updates.content = await extractText(file);
    updates.original_file_path = await uploadOriginal(supabase, user.id, file);
    updates.original_file_name = file.name;
  }

  const { error } = await supabase
    .from("resume_templates")
    .update(updates)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/resumes");
  revalidatePath(`/resumes/${id}`);
  redirect(`/resumes/${id}`);
}

export async function deleteResumeTemplate(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: template } = await supabase
    .from("resume_templates")
    .select("original_file_path")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("resume_templates")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (template?.original_file_path) {
    await supabase.storage.from("resumes").remove([template.original_file_path]);
  }

  revalidatePath("/resumes");
  redirect("/resumes");
}

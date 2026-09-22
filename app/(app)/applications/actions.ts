"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseApplicationForm(formData: FormData) {
  const salaryMinRaw = formData.get("salary_min") as string;
  const salaryMaxRaw = formData.get("salary_max") as string;
  const appliedDateRaw = formData.get("applied_date") as string;

  return {
    company: ((formData.get("company") as string) ?? "").trim(),
    title: ((formData.get("title") as string) ?? "").trim(),
    status: (formData.get("status") as string) || "saved",
    job_url: ((formData.get("job_url") as string) ?? "").trim() || null,
    job_description:
      ((formData.get("job_description") as string) ?? "").trim() || null,
    location: ((formData.get("location") as string) ?? "").trim() || null,
    remote: formData.get("remote") === "on",
    salary_min: salaryMinRaw ? parseInt(salaryMinRaw, 10) : null,
    salary_max: salaryMaxRaw ? parseInt(salaryMaxRaw, 10) : null,
    source: ((formData.get("source") as string) ?? "").trim() || null,
    applied_date: appliedDateRaw || null,
    notes: ((formData.get("notes") as string) ?? "").trim() || null,
  };
}

export async function createApplication(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fields = parseApplicationForm(formData);
  if (!fields.company || !fields.title) {
    throw new Error("Company and title are required.");
  }

  const { error } = await supabase
    .from("applications")
    .insert({ ...fields, user_id: user.id });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}

export async function updateApplication(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fields = parseApplicationForm(formData);
  if (!fields.company || !fields.title) {
    throw new Error("Company and title are required.");
  }

  const { error } = await supabase
    .from("applications")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

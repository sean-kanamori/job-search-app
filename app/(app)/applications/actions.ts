"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus, FollowupType } from "@/lib/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

function parseApplicationForm(formData: FormData) {
  const salaryMinRaw = formData.get("salary_min") as string;
  const salaryMaxRaw = formData.get("salary_max") as string;
  const appliedDateRaw = formData.get("applied_date") as string;

  return {
    company: ((formData.get("company") as string) ?? "").trim(),
    title: ((formData.get("title") as string) ?? "").trim(),
    status: ((formData.get("status") as string) || "saved") as ApplicationStatus,
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

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function logEvent(
  supabase: SupabaseServerClient,
  userId: string,
  applicationId: string,
  eventType: string,
  description: string
) {
  await supabase.from("application_events").insert({
    user_id: userId,
    application_id: applicationId,
    event_type: eventType,
    description,
  });
}

/** What follow-up (if any) to propose when an application moves into this status. */
function suggestedFollowup(
  status: ApplicationStatus
): { type: FollowupType; dueDate: string; notes: string } | null {
  if (status === "applied") {
    return {
      type: "check-in",
      dueDate: addDays(7),
      notes: "Check in if you haven't heard back yet.",
    };
  }
  if (status === "interviewing") {
    return {
      type: "thank-you",
      dueDate: addDays(1),
      notes: "Send a thank-you note after the interview.",
    };
  }
  return null;
}

/**
 * Runs whenever an application's status actually changes: logs it,
 * proposes a follow-up reminder for the new status, and clears out
 * stale reminders once the application is no longer live.
 */
async function handleStatusTransition(
  supabase: SupabaseServerClient,
  userId: string,
  applicationId: string,
  fromStatus: ApplicationStatus,
  toStatus: ApplicationStatus
) {
  if (fromStatus === toStatus) return;

  await logEvent(
    supabase,
    userId,
    applicationId,
    "status_change",
    `Status changed from ${STATUS_LABELS[fromStatus]} to ${STATUS_LABELS[toStatus]}.`
  );

  if (toStatus === "rejected" || toStatus === "withdrawn") {
    const { data: cleared } = await supabase
      .from("followups")
      .update({ done: true })
      .eq("application_id", applicationId)
      .eq("done", false)
      .select("id");

    if (cleared && cleared.length > 0) {
      await logEvent(
        supabase,
        userId,
        applicationId,
        "followups_cleared",
        `Cleared ${cleared.length} pending follow-up${cleared.length === 1 ? "" : "s"} — application closed out.`
      );
    }
    return;
  }

  const suggestion = suggestedFollowup(toStatus);
  if (suggestion) {
    await supabase.from("followups").insert({
      user_id: userId,
      application_id: applicationId,
      due_date: suggestion.dueDate,
      type: suggestion.type,
      notes: suggestion.notes,
    });
    await logEvent(
      supabase,
      userId,
      applicationId,
      "followup_suggested",
      `Suggested a ${suggestion.type} follow-up for ${suggestion.dueDate}.`
    );
  }
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

  const { data: inserted, error } = await supabase
    .from("applications")
    .insert({ ...fields, user_id: user.id })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await logEvent(
    supabase,
    user.id,
    inserted.id,
    "created",
    `Application created for ${fields.title} at ${fields.company}.`
  );

  // Treat "created straight into applied/interviewing" the same as a
  // transition from a neutral starting point, so the suggestion logic
  // still fires (e.g. logging an application after the fact).
  await handleStatusTransition(
    supabase,
    user.id,
    inserted.id,
    "saved",
    fields.status
  );

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

  const { data: before } = await supabase
    .from("applications")
    .select("status")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("applications")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (before) {
    await handleStatusTransition(
      supabase,
      user.id,
      id,
      before.status as ApplicationStatus,
      fields.status
    );
  }

  revalidatePath("/");
  revalidatePath(`/applications/${id}`);
  revalidatePath(`/applications/${id}/activity`);
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

export async function createFollowup(applicationId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const type = (formData.get("type") as string) || "other";
  const dueDate = formData.get("due_date") as string;
  const notes = ((formData.get("notes") as string) ?? "").trim() || null;

  if (!dueDate) throw new Error("Due date is required.");

  const { error } = await supabase.from("followups").insert({
    user_id: user.id,
    application_id: applicationId,
    type,
    due_date: dueDate,
    notes,
  });
  if (error) throw new Error(error.message);

  await logEvent(
    supabase,
    user.id,
    applicationId,
    "followup_added",
    `Added a ${type} follow-up for ${dueDate}.`
  );

  revalidatePath(`/applications/${applicationId}/activity`);
  redirect(`/applications/${applicationId}/activity`);
}

export async function completeFollowup(
  followupId: string,
  applicationId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: followup, error } = await supabase
    .from("followups")
    .update({ done: true })
    .eq("id", followupId)
    .select("type, due_date")
    .single();
  if (error) throw new Error(error.message);

  await logEvent(
    supabase,
    user.id,
    applicationId,
    "followup_completed",
    `Completed the ${followup.type} follow-up that was due ${followup.due_date}.`
  );

  revalidatePath(`/applications/${applicationId}/activity`);
  redirect(`/applications/${applicationId}/activity`);
}

export async function deleteFollowup(
  followupId: string,
  applicationId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("followups")
    .delete()
    .eq("id", followupId);
  if (error) throw new Error(error.message);

  revalidatePath(`/applications/${applicationId}/activity`);
  redirect(`/applications/${applicationId}/activity`);
}

export async function createContact(applicationId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = ((formData.get("name") as string) ?? "").trim();
  const role = ((formData.get("role") as string) ?? "").trim() || null;
  const email = ((formData.get("email") as string) ?? "").trim() || null;
  const phone = ((formData.get("phone") as string) ?? "").trim() || null;
  const linkedin_url =
    ((formData.get("linkedin_url") as string) ?? "").trim() || null;
  const notes = ((formData.get("notes") as string) ?? "").trim() || null;

  if (!name) throw new Error("Name is required.");

  const { error } = await supabase.from("contacts").insert({
    user_id: user.id,
    application_id: applicationId,
    name,
    role,
    email,
    phone,
    linkedin_url,
    notes,
  });
  if (error) throw new Error(error.message);

  await logEvent(
    supabase,
    user.id,
    applicationId,
    "contact_added",
    `Added contact: ${name}${role ? ` (${role})` : ""}.`
  );

  revalidatePath(`/applications/${applicationId}/activity`);
  redirect(`/applications/${applicationId}/activity`);
}

export async function deleteContact(contactId: string, applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId);
  if (error) throw new Error(error.message);

  revalidatePath(`/applications/${applicationId}/activity`);
  redirect(`/applications/${applicationId}/activity`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export type Application = {
  id: string;
  user_id: string;
  company: string;
  title: string;
  status: ApplicationStatus;
  job_url: string | null;
  job_description: string | null;
  location: string | null;
  remote: boolean | null;
  salary_min: number | null;
  salary_max: number | null;
  source: string | null;
  applied_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FollowupType = "thank-you" | "check-in" | "other";

export type Followup = {
  id: string;
  user_id: string;
  application_id: string;
  due_date: string;
  type: FollowupType;
  notes: string | null;
  done: boolean;
  contact_id: string | null;
  created_at: string;
};

export type ResumeTemplate = {
  id: string;
  user_id: string;
  name: string;
  content: string;
  original_file_path: string | null;
  original_file_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  user_id: string;
  application_id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  notes: string | null;
  created_at: string;
};

export type ApplicationEvent = {
  id: string;
  user_id: string;
  application_id: string;
  event_type: string;
  description: string;
  occurred_at: string;
};

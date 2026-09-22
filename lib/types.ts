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

export interface JobPost {
  id?: string;
  recruiter_id: string;
  job_title: string;
  location?: string;
  modules_required?: string;
  skills_required?: string;
  certifications_required?: string;
  experience_min?: number;
  experience_max?: number;
  employment_type?: string;
  compensation_range?: string;
  job_description?: string;
  notice_period?: string;
  status_id: string;
  application_deadline?: string; // YYYY-MM-DD format
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

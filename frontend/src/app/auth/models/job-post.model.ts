import { Application } from './application.model'; // ✅ Add this import

export interface JobPost {
  id?: string; // UUID
  recruiter_id: string; // UUID of the recruiter
  job_title: string;
  modules_required?: string; // Comma-separated values
  skills_required?: string; // Comma-separated values
  certifications_required?: string; // Comma-separated values
  experience_min?: number; // In years (e.g., 1.5)
  experience_max?: number; // In years (e.g., 4.0)
  employment_type?: 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Freelance';
   currency_id?: string;
  compensation_value?: number;
  salary_type?: string; // e.g. "$1000 - $2000"
  job_description?: string;
  notice_period?: string; // e.g. "1 month", "15 days"
  status_id: string; // UUID of the status
  application_deadline?: string; // Format: 'YYYY-MM-DD'
  created_at?: string; // ISO 8601 format
  updated_at?: string; // ISO 8601 format
  created_by?: string; // UUID
  updated_by?: string; // UUID

  // ✅ New fields added for job detail view
  work_mode?: 'Remote' | 'On-site' | 'Hybrid';
  role_summary?: string;
  preferred_qualifications?: string;
  what_we_offer?: string;
  how_to_apply?: string;

  // ✅ Add applications relationship
  applications?: Application[];
  applicationsCount?: number;

   skill_ids?: string[];        // Add this
  certification_ids?: string[]; // Add this
   job_number: number; // ✅ Added
   region_id: string;
   country_id: string;
    location?: string;
}

export interface Applicant {
  id: string;
  application_id: string;
  name: string;
  email: string;
  appliedDate: string;
  status: string;
  status_id: string;
  job_id: string;
  job_title: string;
  withdrawn: boolean;
  candidate_id: string;
  resumeUrl: string | null;
}

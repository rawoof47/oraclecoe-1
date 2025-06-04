import { JobPost } from './job-post.model';

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  application_status_id: string;
  withdrawn: boolean;
  created_at: string;
  job_post?: JobPost;  // Make optional
}
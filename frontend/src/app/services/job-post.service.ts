import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPost } from '../auth/models/job-post.model';

export interface JobPostResponse {
  message: string;
  data: JobPost;
}

export interface JobPostListResponse {
  message: string;
  data: JobPost[];
}

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private baseUrl = 'http://localhost:3000/job-posts';
  private skillUrl = 'http://localhost:3000/skills';
  private jobPostSkillsUrl = 'http://localhost:3000/job-post-skills';
  private certificationsUrl = 'http://localhost:3000/certifications';
  private jobPostCertificationsUrl = 'http://localhost:3000/job-post-certifications';
  private applicationUrl = 'http://localhost:3000/applications';

  constructor(private http: HttpClient) {}

  /**
   * Create a new job post
   */
  create(jobPost: JobPost): Observable<JobPostResponse> {
    return this.http.post<JobPostResponse>(this.baseUrl, jobPost);
  }

  /**
   * Update an existing job post by ID
   */
  update(id: string, jobPost: JobPost): Observable<JobPostResponse> {
    return this.http.put<JobPostResponse>(`${this.baseUrl}/${id}`, jobPost);
  }

  /**
   * Get all job posts
   */
  getAll(): Observable<JobPostListResponse> {
    return this.http.get<JobPostListResponse>(this.baseUrl);
  }

  /**
   * Get a single job post by ID
   */
  getById(id: string): Observable<JobPostResponse> {
    return this.http.get<JobPostResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Delete a job post by ID
   */
  delete(id: string): Observable<JobPostResponse> {
    return this.http.delete<JobPostResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * ✅ Get Oracle Domain Expertise Options by Category ID
   */
  getFunctionalSkills(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.skillUrl}/${categoryId}`);
  }

  /**
   * ✅ Save selected skills for a job post
   */
  saveSkills(jobPostId: string, skillIds: string[]): Observable<any> {
    return this.http.post(this.jobPostSkillsUrl, {
      jobPostId,
      skillIds,
    });
  }

  /**
   * ✅ Get certifications by category ID
   */
  getCertificationsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.certificationsUrl}/by-category/${categoryId}`);
  }

  /**
   * ✅ Save selected certifications for a job post
   */
  saveCertifications(jobPostId: string, certificationIds: string[]): Observable<any> {
    return this.http.post(`${this.jobPostCertificationsUrl}`, {
      job_post_id: jobPostId,
      certification_ids: certificationIds,
    });
  }

  /**
   * 🔄 Get all job-post-skill mappings (used in filters)
   */
  getJobPostSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jobPostSkillsUrl}/mappings`);
  }

  /**
   * 🔄 Get all job-post-certification mappings (used in filters)
   */
  getJobPostCertifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jobPostCertificationsUrl}/mappings`);
  }

  /**
   * 🆕 Get skills by job post ID
   */
  getSkillsByJobPostId(jobPostId: string): Observable<any> {
    return this.http.get<any>(`${this.jobPostSkillsUrl}/${jobPostId}`);
  }

  /**
   * 🆕 Get certifications by job post ID
   */
  getCertificationsByJobPostId(jobPostId: string): Observable<any> {
    return this.http.get<any>(`${this.jobPostCertificationsUrl}/${jobPostId}`);
  }

  /**
   * 🆕 Check if user has already applied to a job
   */
  checkIfUserApplied(userId: string, jobId: string): Observable<{ applied: boolean }> {
    return this.http.post<{ applied: boolean }>(
      `${this.applicationUrl}/check-by-user-and-job`,
      { user_id: userId, job_id: jobId }
    );
  }

  /**
   * 🆕 Apply to a job
   */
  applyToJob(userId: string, jobId: string): Observable<any> {
    return this.http.post(`${this.applicationUrl}/by-user`, {
      user_id: userId,
      job_id: jobId
    });
  }
}

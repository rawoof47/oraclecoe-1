import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPost } from '../auth/models/job-post.model';
import { Application } from '../auth/models/application.model'; // ✅ Correct import

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
  private candidateProfilesUrl = 'http://localhost:3000/candidate-profiles';

  constructor(private http: HttpClient) {}

  create(jobPost: JobPost): Observable<JobPostResponse> {
    return this.http.post<JobPostResponse>(this.baseUrl, jobPost);
  }

  update(id: string, jobPost: JobPost): Observable<JobPostResponse> {
    return this.http.put<JobPostResponse>(`${this.baseUrl}/${id}`, jobPost);
  }

  getAll(): Observable<JobPostListResponse> {
    return this.http.get<JobPostListResponse>(this.baseUrl);
  }

  getById(id: string): Observable<JobPostResponse> {
    return this.http.get<JobPostResponse>(`${this.baseUrl}/${id}`);
  }

  delete(id: string): Observable<JobPostResponse> {
    return this.http.delete<JobPostResponse>(`${this.baseUrl}/${id}`);
  }

  getFunctionalSkills(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.skillUrl}/${categoryId}`);
  }

  saveSkills(jobPostId: string, skillIds: string[]): Observable<any> {
    return this.http.post(this.jobPostSkillsUrl, {
      jobPostId,
      skillIds,
    });
  }

  getCertificationsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.certificationsUrl}/by-category/${categoryId}`);
  }

  saveCertifications(jobPostId: string, certificationIds: string[]): Observable<any> {
    return this.http.post(`${this.jobPostCertificationsUrl}`, {
      job_post_id: jobPostId,
      certification_ids: certificationIds,
    });
  }

  getJobPostSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jobPostSkillsUrl}/mappings`);
  }

  getJobPostCertifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jobPostCertificationsUrl}/mappings`);
  }

  getSkillsByJobPostId(jobPostId: string): Observable<any> {
    return this.http.get<any>(`${this.jobPostSkillsUrl}/${jobPostId}`);
  }

  getCertificationsByJobPostId(jobPostId: string): Observable<any> {
    return this.http.get<any>(`${this.jobPostCertificationsUrl}/${jobPostId}`);
  }

  /**
   * ✅ Updated to include include_withdrawn flag
   */
  checkIfUserApplied(userId: string, jobId: string): Observable<{ applied: boolean }> {
    return this.http.post<{ applied: boolean }>(
      `${this.applicationUrl}/check-by-user-and-job`,
      {
        user_id: userId,
        job_id: jobId,
        include_withdrawn: false,
      }
    );
  }

  applyToJob(userId: string, jobId: string): Observable<any> {
    return this.http.post(`${this.applicationUrl}/by-user`, {
      user_id: userId,
      job_id: jobId
    });
  }

  getCandidateProfile(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.candidateProfilesUrl}/by-user/${userId}`
    );
  }

  getAppliedJobIdsByCandidate(candidateId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.applicationUrl}/user/${candidateId}`
    );
  }

  getAppliedJobIdsByUser(userId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.applicationUrl}/by-user/${userId}`
    );
  }

  /**
   * 🆕 Withdraw a job application
   */
  withdrawApplication(applicationId: string, userId: string, reason: string): Observable<any> {
    return this.http.put(`${this.applicationUrl}/withdraw/${applicationId}`, {
      user_id: userId,
      reason: reason,
    });
  }

  /**
   * 🆕 Get full application records by user ID
   */
  getApplicationsByUserFull(userId: string): Observable<Application[]> {
    return this.http.get<Application[]>(
      `${this.applicationUrl}/by-user-full/${userId}`
    );
  }

  /**
   * 🆕 Get job title by job ID
   */
  getJobTitle(jobId: string): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.baseUrl}/${jobId}`);
  }

  /**
   * 🆕 Get applications submitted to jobs owned by a recruiter
   */
  getApplicationsByRecruiter(recruiterId: string): Observable<Application[]> {
    return this.http.get<Application[]>(
      `${this.applicationUrl}/by-recruiter/${recruiterId}`
    );
  }

  /**
   * 🆕 Update application status (e.g., shortlist, reject)
   */
  updateApplicationStatus(applicationId: string, status: string): Observable<Application> {
    return this.http.put<Application>(
      `${this.applicationUrl}/${applicationId}/status`,
      { status }
    );
  }
  getByRecruiter(recruiterId: string): Observable<JobPostListResponse> {
  return this.http.get<JobPostListResponse>(
    `${this.baseUrl}/by-recruiter/${recruiterId}`
  );
}
getApplicationsCountByJobIds(jobIds: string[]): Observable<Record<string, number>> {
  return this.http.post<Record<string, number>>(
    `${this.applicationUrl}/count-by-jobs`,
    { jobIds }
  );
}

// ✅ Add method to update job status
  updateStatus(jobId: string, statusId: string): Observable<JobPostResponse> {
    return this.http.put<JobPostResponse>(
      `${this.baseUrl}/status/${jobId}`,
      { statusId }
    );
  }

  getActiveJobs(): Observable<JobPostListResponse> {
  return this.http.get<JobPostListResponse>(
    `${this.baseUrl}/active/list`
  );
}
}

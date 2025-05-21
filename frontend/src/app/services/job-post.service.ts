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
}

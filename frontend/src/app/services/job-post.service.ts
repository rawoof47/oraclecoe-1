import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPost } from '../auth/models/job-post.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  // 🔧 Backend API URL (adjust according to environment)
  private baseUrl = 'http://localhost:3000/job-posts';

  constructor(private http: HttpClient) {}

  /**
   * Create a new job post
   */
  create(jobPost: JobPost): Observable<JobPost> {
    return this.http.post<JobPost>(this.baseUrl, jobPost);
  }

  /**
   * Update an existing job post by ID
   */
  update(id: string, jobPost: JobPost): Observable<JobPost> {
    return this.http.put<JobPost>(`${this.baseUrl}/${id}`, jobPost);
  }

  /**
   * Get all job posts
   */
  getAll(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(this.baseUrl);
  }

  /**
   * Get a single job post by ID
   */
  getById(id: string): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.baseUrl}/${id}`);
  }

  /**
   * Delete a job post by ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

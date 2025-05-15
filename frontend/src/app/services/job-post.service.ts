import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPost } from '../auth/models/job-post.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private baseUrl = 'http://localhost:3000/job-posts'; // Update this if needed

  constructor(private http: HttpClient) {}

  create(jobPost: JobPost): Observable<JobPost> {
    return this.http.post<JobPost>(this.baseUrl, jobPost);
  }

  update(id: string, jobPost: JobPost): Observable<JobPost> {
    return this.http.put<JobPost>(`${this.baseUrl}/${id}`, jobPost);
  }

  getAll(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(this.baseUrl);
  }

  getById(id: string): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.baseUrl}/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

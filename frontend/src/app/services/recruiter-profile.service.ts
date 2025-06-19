import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class RecruiterProfileService {
  private backendBaseUrl = 'http://localhost:3000';
  private baseUrl = `${this.backendBaseUrl}/recruiter-profiles`;

  constructor(
    private http: HttpClient,
    private authState: AuthStateService
  ) {}

  /**
   * Save or update recruiter profile
   */
  saveRecruiterProfile(data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/upsert`, data, { headers });
  }

  /**
   * Get recruiter profile for the currently logged-in user
   */
  getMyProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/by-user/me`, { headers });
  }
}

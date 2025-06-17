import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // ✅ Save or update recruiter profile
  saveRecruiterProfile(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/upsert`, data);
  }

  // 🔍 Get recruiter profile for current user
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-user/me`);
  }
}

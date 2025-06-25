import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';
import { Industry } from '../auth/models/recruiter-profile.model';

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

  // ✅ Save or update recruiter profile with industry IDs
  saveRecruiterProfile(data: {
    user_id: string;
    company_name: string;
    industryIds: string[];
    company_size: string;
    website: string;
    company_description: string;
    recruiter_position: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/upsert`, data);
  }

  // 🔍 Get recruiter profile for current user
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-user/me`);
  }

  // 📦 Fetch available industries
  getIndustries(): Observable<Industry[]> {
    return this.http.get<Industry[]>(`${this.backendBaseUrl}/industries`);
  }
}

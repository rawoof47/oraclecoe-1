import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
=======
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';
>>>>>>> 7be5bb022177a14e6542ada53a1403fe85feae39

@Injectable({
  providedIn: 'root'
})
export class RecruiterProfileService {
<<<<<<< HEAD
  private apiUrl = 'http://localhost:3000/recruiter-profiles';

  constructor(private http: HttpClient) {}

  createRecruiterProfile(data: any): Observable<any> {
    const token = localStorage.getItem('access_token'); // or wherever you stored it
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
=======
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
>>>>>>> 7be5bb022177a14e6542ada53a1403fe85feae39
  }
}

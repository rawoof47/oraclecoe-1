import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecruiterLocation } from '../auth/models/recruiter-location.model';

@Injectable({
  providedIn: 'root',
})
export class RecruiterLocationService {
  private baseUrl = 'http://localhost:3000/recruiter-locations'; // adjust if using proxy

  constructor(private http: HttpClient) {}

  // ✅ Upsert location (create or update)
  upsertLocation(data: {
    recruiter_profile_id: string;
    region_id: string;
    country_id?: string | null;
  }): Observable<RecruiterLocation> {
    return this.http.post<RecruiterLocation>(`${this.baseUrl}`, data);
  }

  // ✅ Get location by recruiter profile ID
  getLocationByProfile(profileId: string): Observable<RecruiterLocation> {
    return this.http.get<RecruiterLocation>(`${this.baseUrl}/profile/${profileId}`);
  }
}

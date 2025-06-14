import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {
  private backendBaseUrl = 'http://localhost:3000';
  private baseUrl = `${this.backendBaseUrl}/candidate-profiles`;
  private skillUrl = `${this.backendBaseUrl}/skills`;
  private certificationUrl = `${this.backendBaseUrl}/certifications`;
  private userUrl = `${this.backendBaseUrl}/users`;

  constructor(private http: HttpClient, private authState: AuthStateService) {}

  /**
   * Save candidate profile
   * Payload includes details like about_me, summary, education, skill_ids, etc.
   */
  saveCandidateProfile(data: any): Observable<any> {
    // Change endpoint to /upsert
    return this.http.post(`${this.baseUrl}/upsert`, data);
  }

  /**
   * Get skills by category ID
   */
  getSkillsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.skillUrl}/${categoryId}`);
  }

  /**
   * Get all skills
   */
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(this.skillUrl);
  }

  /**
   * Get certifications by category ID
   */
  getCertificationsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.certificationUrl}/by-category/${categoryId}`);
  }

  /**
   * Update user's name
   */
  updateUserName(userId: string, firstName: string, lastName: string, middleName?: string): Observable<any> {
    return this.http.put(`${this.userUrl}/update-name/${userId}`, {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName || ''
    });
  }

  /**
   * Save candidate skills (bulk replace)
   */
  saveCandidateSkills(userId: string, skillIds: string[]): Observable<any> {
    return this.http.post(`${this.backendBaseUrl}/candidate_skills/bulk-replace`, {
      user_id: userId,
      skill_ids: skillIds
    });
  }

  /**
   * Save candidate certifications (bulk replace)
   */
  saveCandidateCertifications(userId: string, certificationIds: string[]): Observable<any> {
    return this.http.post(
      `${this.backendBaseUrl}/candidate_certifications/bulk-replace`, // FIXED
      { user_id: userId, certification_ids: certificationIds }
    );
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-user/me`);
  }

  getCandidateSkills(userId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.backendBaseUrl}/candidate_skills/skills/${userId}`
    );
  }

  // ✅ Modified as per request: simplified to return certification_name[] directly
  getCandidateCertifications(userId: string): Observable<string[]> {
    return this.http.get<any[]>(
      `${this.backendBaseUrl}/candidate_certifications/user/${userId}`
    ).pipe(
      map(certs => certs.map(c => c.certification.certification_name))
    );
  }

  updateUserContactInfo(
  userId: string, 
  email: string, 
  mobileNumber?: string
): Observable<any> {
  return this.http.put(`${this.userUrl}/${userId}`, {
    email: email,
    mobile_number: mobileNumber
  });
}
// Add to CandidateProfileService
getUser(userId: string): Observable<any> {
  return this.http.get(`${this.userUrl}/${userId}`);
}
}

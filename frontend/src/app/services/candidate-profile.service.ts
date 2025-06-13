import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {
  private backendBaseUrl = 'http://localhost:3000';
  private baseUrl = `${this.backendBaseUrl}/candidate-profiles`;
  private skillUrl = `${this.backendBaseUrl}/skills`;
  private certificationUrl = `${this.backendBaseUrl}/certifications`;
  private userUrl = `${this.backendBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Save candidate profile
   */
  saveCandidateProfile(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
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
  // candidate-profile.service.ts
saveCandidateCertifications(userId: string, certificationIds: string[]): Observable<any> {
  return this.http.post(
    `${this.backendBaseUrl}/candidate_certifications/bulk-replace`, // FIXED
    { user_id: userId, certification_ids: certificationIds }
  );
}
}

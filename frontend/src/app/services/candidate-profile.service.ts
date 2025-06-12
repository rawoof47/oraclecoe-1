import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {
  private baseUrl = 'http://localhost:3000/candidate-profiles';
  private skillUrl = 'http://localhost:3000/skills';
  private certificationUrl = 'http://localhost:3000/certifications';
<<<<<<< HEAD
=======
  private userUrl = 'http://localhost:3000/users';
>>>>>>> 729a3cd (feat:(profile page))

  constructor(private http: HttpClient) {}

  /**
   * Save candidate profile
   * Payload includes details like about_me, summary, education, skill_ids, etc.
   */
  saveCandidateProfile(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  /**
   * Get skills by category ID
   * Example: /skills/1 returns all functional skills
   */
  getSkillsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.skillUrl}/${categoryId}`);
  }
// New method to fetch certifications by category
getCertificationsByCategory(categoryId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.certificationUrl}/by-category/${categoryId}`);
}
  /**
   * Get all available skills
   */
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(this.skillUrl);
  }

  /**
   * Get certifications by category ID
   * Example: /certifications/by-category/xyz
   */
  getCertificationsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.certificationUrl}/by-category/${categoryId}`);
  }

  /**
   * Update user's name
   * Sends PATCH to /users/:id with { first_name, last_name, middle_name }
   */
  updateUserName(userId: string, firstName: string, lastName: string, middleName?: string): Observable<any> {
  // Change to PUT request with correct endpoint
  return this.http.put(`${this.userUrl}/update-name/${userId}`, {
    first_name: firstName,
    last_name: lastName,
    middle_name: middleName || ''
  });
}

  saveCandidateSkills(userId: string, skillIds: string[]) {
  return this.http.post('/api/candidate_skills/bulk-replace', {
    user_id: userId,
    skill_ids: skillIds
  });
}
saveCandidateCertifications(userId: string, certificationIds: string[]): Observable<any> {
  return this.http.post('/api/candidate-certifications/bulk-replace', {
    user_id: userId,
    certification_ids: certificationIds
  });
}
}
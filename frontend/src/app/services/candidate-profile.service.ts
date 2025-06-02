import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {
  private baseUrl = 'http://localhost:3000/candidate-profiles';
  private skillUrl = 'http://localhost:3000/skills';

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

  /**
   * Get all available skills (not used for category-wise selection, but kept optionally)
   */
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(this.skillUrl);
  }
}

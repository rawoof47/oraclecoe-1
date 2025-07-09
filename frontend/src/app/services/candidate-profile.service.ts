import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service'; // Adjust path if needed
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {
  private backendBaseUrl = environment.apiBaseUrl;
  private baseUrl = `${this.backendBaseUrl}/candidate-profiles`;
  private skillUrl = `${this.backendBaseUrl}/skills`;
  private certificationUrl = `${this.backendBaseUrl}/certifications`;
  private userUrl = `${this.backendBaseUrl}/users`;
  private degreeUrl = `${this.backendBaseUrl}/degrees`; // ✅ Degree endpoint

  constructor(
    private http: HttpClient,
    private authState: AuthStateService
  ) {}

  /**
   * Save candidate profile
   */
  saveCandidateProfile(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/upsert`, data);
  }

  /**
   * Get all skills
   */
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(this.skillUrl);
  }

  /**
   * Get skills by category ID
   */
  getSkillsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.skillUrl}/${categoryId}`);
  }

  /**
   * Get all degrees
   */
  getAllDegrees(): Observable<any[]> {
    return this.http.get<any[]>(this.degreeUrl);
  }

  /**
   * Get certifications by category ID
   */
  getCertificationsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.certificationUrl}/by-category/${categoryId}`);
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
    return this.http.post(`${this.backendBaseUrl}/candidate_certifications/bulk-replace`, {
      user_id: userId,
      certification_ids: certificationIds
    });
  }

  /**
   * Get candidate profile for logged-in user
   */
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-user/me`);
  }

  /**
   * Get candidate skills by user ID
   */
  getCandidateSkills(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.backendBaseUrl}/candidate_skills/skills/${userId}`);
  }

  /**
   * Get candidate certifications by user ID
   */
  getCandidateCertifications(userId: string): Observable<string[]> {
    return this.http.get<any[]>(`${this.backendBaseUrl}/candidate_certifications/user/${userId}`)
      .pipe(map(certs => certs.map(c => c.certification.certification_name)));
  }

  /**
   * Update user's contact info
   */
  updateUserContactInfo(userId: string, email: string, mobileNumber?: string): Observable<any> {
    return this.http.put(`${this.userUrl}/${userId}`, {
      email,
      mobile_number: mobileNumber
    });
  }

  /**
   * Update user's name
   */
  updateUserName(userId: string, firstName: string, lastName: string, middleName?: string): Observable<any> {
    return this.http.put(`${this.userUrl}/update-name/${userId}`, {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName || ''
    }).pipe(
      tap(() => {
        this.authState.updateStoredUserName(firstName, lastName);
      })
    );
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.userUrl}/${userId}`);
  }

  saveCandidateDegrees(userId: string, degreeIds: string[]): Observable<any> {
  return this.http.post(`${this.backendBaseUrl}/candidate_degrees/bulk-replace`, {
    user_id: userId,
    degree_ids: degreeIds
  });
}

// Add this method to get candidate degrees
getCandidateDegrees(userId: string): Observable<string[]> {
  return this.http.get<any[]>(`${this.backendBaseUrl}/candidate_degrees/user/${userId}`)
    .pipe(map(degrees => degrees.map(d => d.degree.name))); // Changed from degree_name to name
}

uploadProfileImage(formData: FormData) {
  return this.http.post<{ url: string }>('http://localhost:3000/upload/profile-pic', formData);
}

uploadResume(formData: FormData) {
  return this.http.post<{ url: string }>('http://localhost:3000/upload/resume', formData);
}


}

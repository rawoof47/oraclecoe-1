import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Update the user's email
   * @param userId - User's UUID
   * @param email - New email to set
   */
  updateEmail(userId: string, email: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${userId}/email`, { email });
  }

  /**
   * Update the user's password
   * @param userId - User's UUID
   * @param password - New password to set
   */
  updatePassword(userId: string, password: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${userId}/password`, { password });
  }
}

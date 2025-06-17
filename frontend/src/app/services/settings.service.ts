import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  updateEmail(userId: string, email: string) {
    return this.http.patch(`${this.baseUrl}/${userId}/email`, { email });
  }

  updatePassword(userId: string, password: string) {
    return this.http.patch(`${this.baseUrl}/${userId}/password`, { password });
  }
}

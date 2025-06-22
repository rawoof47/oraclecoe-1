import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../auth/models/register-request.model';
import { LoginRequest } from '../auth/models/login-request.model';
import { LoginResponse } from '../auth/models/login-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/users`, data);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  loginAsAdmin(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin-login`, credentials);
  }

  refreshToken(refreshToken: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {
      refreshToken,
    });
  }

  /**
   * Reset password for candidate or recruiter (no email flow)
   */
  resetPassword(email: string, mobile_number: string, role: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      email,
      mobile_number,
      role,
      newPassword,
    });
  }
}

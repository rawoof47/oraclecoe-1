import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { RegisterRequest } from '../auth/models/register-request.model';
import { LoginRequest } from '../auth/models/login-request.model';
import { LoginResponse } from '../auth/models/login-response.model';
import { environment } from '../../environments/environment';
import { AuthStateService } from './auth-state.service'; // ✅ Import AuthStateService

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private authStateService: AuthStateService // ✅ Inject AuthStateService
  ) {}

  /**
   * Register a new user (candidate or recruiter)
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/users`, data);
  }

  /**
   * Log in the user (candidate, recruiter, or admin) and get access & refresh tokens
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Admin-specific login
   */
  loginAsAdmin(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin-login`, credentials);
  }

  /**
   * Refresh the access token using the refresh token
   */
  refreshToken(refreshToken: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {
      refreshToken,
    });
  }

  /**
   * 🔐 Change the password for an authenticated user
   */
 changePassword(currentPassword: string, newPassword: string): Observable<any> {
  const userId = this.authStateService.getCurrentUserId();
  if (!userId) {
    return throwError(() => new Error('User not authenticated'));
  }

  return this.http.post(`${environment.apiBaseUrl}/users/change-password`, {
    user_id: userId,
    current_password: currentPassword,
    new_password: newPassword,
  });
}

  
}

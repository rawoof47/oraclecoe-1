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

  /**
   * Register a new user (candidate or recruiter)
   * @param data RegisterRequest
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/users`, data);
  }

  /**
   * Log in the user and get access & refresh tokens
   * @param credentials LoginRequest
   * @returns Observable<LoginResponse>
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Optionally refresh the access token using the refresh token
   * @param refreshToken string
   */
  refreshToken(refreshToken: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {
      refreshToken,
    });
  }
}

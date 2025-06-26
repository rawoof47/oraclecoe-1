import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private baseUrl = `${environment.backendBaseUrl}/applications`;

  constructor(private http: HttpClient) { }

  getCountsByStatuses(recruiterId: string) {
    return this.http.get<{ shortlisted: number, rejected: number }>(
      `${this.baseUrl}/counts-by-status/${recruiterId}`
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecruiterProfileService {
  private apiUrl = 'http://localhost:3000/recruiter-profiles';

  constructor(private http: HttpClient) {}

  createRecruiterProfile(data: any): Observable<any> {
    const token = localStorage.getItem('access_token'); // or wherever you stored it
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}

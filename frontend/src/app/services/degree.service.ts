import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Degree } from '../auth/models/degree.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DegreeService {
  private apiUrl = 'http://localhost:3000/degrees';

  constructor(private http: HttpClient) {}

  getDegrees(): Observable<Degree[]> {
    return this.http.get<Degree[]>(this.apiUrl);
  }
}

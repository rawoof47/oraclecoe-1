import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Region } from '../auth/models/region.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private baseUrl = 'http://localhost:3000/regions'; // Update if needed

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.baseUrl);
  }
}

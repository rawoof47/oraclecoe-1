import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../auth/models/country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private baseUrl = 'http://localhost:3000/countries';

  constructor(private http: HttpClient) {}

  searchCountries(regionId: string, keyword: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/search`, {
      params: { regionId, keyword },
    });
  }

  // In country.service.ts
getCountryById(id: string): Observable<Country> {
  return this.http.get<Country>(`${this.baseUrl}/${id}`);
}
}

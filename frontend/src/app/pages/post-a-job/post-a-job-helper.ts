import { Injectable } from '@angular/core';
import { RegionService } from '../../services/region.service';
import { CountryService } from '../../services/country.service'; // Add this import
import { Observable, catchError, of } from 'rxjs';
import { Region } from '../../auth/models/region.model';
import { Country } from '../../auth/models/country.model'; // Add this import

@Injectable({
  providedIn: 'root'
})
export class PostAJobHelper {
  constructor(
    private regionService: RegionService,
    private countryService: CountryService // Inject CountryService
  ) {}

  getRegions(): Observable<Region[]> {
    return this.regionService.getRegions().pipe(
      catchError(() => {
        console.error('Failed to fetch regions');
        return of([]);
      })
    );
  }

  // Add this new method to get countries by region
  getCountriesByRegion(regionId: string): Observable<Country[]> {
    return this.countryService.getCountriesByRegion(regionId).pipe(
      catchError(() => {
        console.error('Failed to fetch countries');
        return of([]);
      })
    );
  }
}
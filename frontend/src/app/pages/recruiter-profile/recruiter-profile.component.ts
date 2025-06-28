import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { catchError, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

import { CandidateProfileService } from '../../services/candidate-profile.service';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Industry } from '../../auth/models/recruiter-profile.model';
import { RegionService } from '../../services/region.service';
import { Region } from '../../auth/models/region.model';
import { Country } from '../../auth/models/country.model';
import { CountryService } from '../../services/country.service';
import { RecruiterLocationService } from '../../services/recruiter-location.service';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss']
})
export class RecruiterProfileComponent implements OnInit {
  recruiterForm: FormGroup;
  userId: string | null = null;
  recruiterProfileId: string | null = null; // ✅ Added recruiterProfileId
  isLoading = false;
  industries: Industry[] = [];
  regions: Region[] = [];
  countries: Country[] = [];
  countrySearchControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private candidateProfileService: CandidateProfileService,
    private recruiterProfileService: RecruiterProfileService,
    private authState: AuthStateService,
    private regionService: RegionService,
    private countryService: CountryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private locationService: RecruiterLocationService,
  ) {
    this.recruiterForm = this.fb.group({
      companyName: ['', Validators.required],
      industries: [[], Validators.required],
      companySize: [''],
      website: ['', Validators.required],
      companyDescription: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required],
      region_id: ['', Validators.required],
      country_id: ['', Validators.required],
      city_state: [''] 
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadIndustries();
    this.loadRegions();
    this.loadRecruiterProfile();

    // ✅ Handle region changes to reset country
    this.recruiterForm.get('region_id')?.valueChanges.subscribe(() => {
      this.recruiterForm.get('country_id')?.setValue('');
      this.countrySearchControl.setValue('');
      this.countries = [];
    });

    // ✅ Handle country search with debounce
    this.countrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((keyword) => {
      const regionId = this.recruiterForm.get('region_id')?.value;
      if (regionId && keyword && keyword.length >= 2) {
        this.countryService.searchCountries(regionId, keyword).subscribe({
          next: (data) => (this.countries = data),
          error: (err) => {
            console.error('Failed to fetch countries', err);
          }
        });
      } else {
        this.countries = [];
      }
    });
  }

  isFormInvalid(): boolean {
    return this.isLoading || this.recruiterForm.invalid;
  }

  onCountrySelected(event: MatAutocompleteSelectedEvent): void {
    const country: Country = event.option.value;
    // Set form control to country ID
    this.recruiterForm.get('country_id')?.setValue(country.id);
    // Update input display to show country name
    this.countrySearchControl.setValue(country.name);
  }

  private loadUserData(): void {
    this.userId = this.authState.getCurrentUserId();
    if (this.userId) {
      this.isLoading = true;
      this.candidateProfileService.getUser(this.userId).subscribe({
        next: (user) => {
          this.recruiterForm.patchValue({
            firstName: user.first_name,
            middleName: user.middle_name || '',
            lastName: user.last_name,
            email: user.email,
            phone: user.mobile_number || ''
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open('Failed to load user data', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          console.error('Failed to load user data:', err);
          this.isLoading = false;
        }
      });
    }
  }

  private loadRecruiterProfile(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.recruiterProfileService.getMyProfile().subscribe({
      next: (profile) => {
        if (profile) {
          // ✅ Store the recruiter profile ID
          this.recruiterProfileId = profile.id;
          
          // Patch the form without emitting events to avoid region change reset
          this.recruiterForm.patchValue({
            companyName: profile.company_name,
            industries: profile.industries,
            companySize: profile.company_size,
            website: profile.website,
            companyDescription: profile.company_description,
            position: profile.recruiter_position,
            region_id: profile.region_id,
            country_id: profile.country_id
          }, { emitEvent: false });

          // Set country name if exists
          if (profile.country_id) {
            this.countryService.getCountryById(profile.country_id).subscribe({
              next: (country) => {
                this.countrySearchControl.setValue(country.name);
              },
              error: (err) => {
                console.error('Failed to fetch country by id', err);
                this.countrySearchControl.setValue('');
              }
            });
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load recruiter profile', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        console.error('Failed to load recruiter profile:', err);
        this.isLoading = false;
      }
    });
  }

  private loadIndustries() {
    this.recruiterProfileService.getIndustries().subscribe({
      next: (industries) => {
        this.industries = industries;
      },
      error: (err) => {
        console.error('Failed to load industries', err);
        this.snackBar.open('Failed to load industries', 'Close', { duration: 3000 });
      }
    });
  }

  private loadRegions(): void {
    this.regionService.getRegions().subscribe({
      next: (data) => (this.regions = data),
      error: (err) => {
        console.error('Failed to load regions', err);
        this.snackBar.open('Failed to load regions', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.recruiterForm.invalid || !this.userId) {
      this.recruiterForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    this.isLoading = true;

    const { firstName, middleName, lastName, email, phone } = this.recruiterForm.value;

    this.candidateProfileService.updateUserName(
      this.userId,
      firstName,
      lastName,
      middleName || undefined
    ).pipe(
      tap(() => {
        this.authState.updateStoredUserName(firstName, lastName);
      }),
      switchMap(() => this.saveRecruiterProfile()),
      switchMap(() => this.saveRecruiterLocation()),
      switchMap(() => this.updateContactInfo(email, phone)),
      tap(() => {
        this.snackBar.open('Profile saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/recruiter-dashboard']);
      }),
      catchError((error) => {
        console.error('Failed to update profile:', error);
        this.snackBar.open('Error updating profile', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading = false;
        return of(null);
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadRecruiterProfile();
      },
      error: (err) => {
        console.error('Update pipeline failed:', err);
        this.snackBar.open('Profile update failed', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }

  private saveRecruiterProfile() {
    const { industries, position, ...otherData } = this.recruiterForm.value;

    const recruiterData = {
      ...otherData,
      user_id: this.userId!,
      industryIds: industries,
      company_name: otherData.companyName,
      company_size: otherData.companySize,
      company_description: otherData.companyDescription,
      recruiter_position: position,
      region_id: otherData.region_id,
      country_id: otherData.country_id, // ✅ Send selected country ID
      city_state: otherData.city_state
    };

    return this.recruiterProfileService.saveRecruiterProfile(recruiterData);
  }

  // ✅ Updated with recruiterProfileId and defensive check
  private saveRecruiterLocation() {
    const { region_id, country_id } = this.recruiterForm.value;

    if (!this.recruiterProfileId) return of(null); // ✅ defensive check

    return this.locationService.upsertLocation({
      recruiter_profile_id: this.recruiterProfileId, // ✅ Correct ID now
      region_id,
      country_id: country_id || null
    });
  }

  private updateContactInfo(email: string, phone?: string) {
    if (!this.userId) return of(null);

    return this.candidateProfileService.updateUserContactInfo(
      this.userId,
      email,
      phone || undefined
    );
  }
}
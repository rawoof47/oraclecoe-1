import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // ✅ Router added
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

import { CandidateProfileService } from '../../services/candidate-profile.service';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { AuthStateService } from '../../services/auth-state.service';

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
    MatSnackBarModule
  ],
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss']
})
export class RecruiterProfileComponent implements OnInit {
  recruiterForm: FormGroup;
  userId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private candidateProfileService: CandidateProfileService,
    private recruiterProfileService: RecruiterProfileService,
    private authState: AuthStateService,
    private snackBar: MatSnackBar,
    private router: Router // ✅ Injected Router
  ) {
    this.recruiterForm = this.fb.group({
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      companySize: ['', Validators.required],
      website: ['', Validators.required],
      companyDescription: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      position: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadRecruiterProfile();
  }

  loadUserData(): void {
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

  loadRecruiterProfile(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.recruiterProfileService.getMyProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.recruiterForm.patchValue({
            companyName: profile.company_name,
            industry: profile.industry,
            companySize: profile.company_size,
            website: profile.website,
            companyDescription: profile.company_description,
            position: profile.recruiter_position
          });
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
      tap(() => {
        this.snackBar.open('Profile saved', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }),
      switchMap(() => this.updateContactInfo(email, phone)),
      tap(() => {
        this.snackBar.open('Profile saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/recruiter-dashboard']); // ✅ Redirect
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
    const { companyName, industry, companySize, website, companyDescription, position } = this.recruiterForm.value;

    const recruiterData = {
      user_id: this.userId!,
      company_name: companyName,
      industry: industry,
      company_size: companySize,
      website: website,
      company_description: companyDescription,
      recruiter_position: position
    };

    return this.recruiterProfileService.saveRecruiterProfile(recruiterData);
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

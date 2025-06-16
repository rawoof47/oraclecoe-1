import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RouterModule } from '@angular/router';
import { CandidateProfileService } from '../../services/candidate-profile.service';
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
    private authState: AuthStateService
  ) {
    this.recruiterForm = this.fb.group({
      // Company Info
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      companySize: ['', Validators.required],
      website: ['', Validators.required],
      companyDescription: ['', Validators.required],

      // Recruiter Info
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
          console.error('Failed to load user data:', err);
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.recruiterForm.invalid || !this.userId) {
      this.recruiterForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { firstName, middleName, lastName, email, phone } = this.recruiterForm.value;

    // First update the name fields
    this.candidateProfileService.updateUserName(
      this.userId,
      firstName,
      lastName,
      middleName || undefined // Pass undefined if empty to maintain existing value
    ).subscribe({
      next: () => {
        // Then update contact info
        this.updateContactInfo(email, phone);
        
        // Update the stored user name in auth state
        this.authState.updateStoredUserName(firstName, lastName);
        
        // Here you would add logic to save recruiter-specific fields
        console.log('Recruiter profile updated successfully');
      },
      error: (err) => {
        console.error('Failed to update name:', err);
        this.isLoading = false;
      }
    });
  }

  updateContactInfo(email: string, phone?: string): void {
    if (!this.userId) return;

    this.candidateProfileService.updateUserContactInfo(
      this.userId,
      email,
      phone || undefined
    ).subscribe({
      next: () => {
        this.isLoading = false;
        console.log('Contact info updated successfully');
      },
      error: (err) => {
        console.error('Failed to update contact info:', err);
        this.isLoading = false;
      }
    });
  }
}
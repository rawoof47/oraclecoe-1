import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  profileForm!: FormGroup;
  isSubmitting = false;

  private readonly apiUrl = 'http://localhost:3000/candidate-profiles';

  ngOnInit(): void {
    console.log('[CandidateProfile] Initializing component...');
    this.initializeForm();
  }

  initializeForm(): void {
    console.log('[CandidateProfile] Initializing form...');
    this.profileForm = this.fb.group({
      about_me: [''],
      professional_summary: [''],
      social_links: [''],
      resume_link: ['', Validators.pattern('https?://.+')],
      education: [''],
      experience_years: [null, [Validators.min(0), Validators.max(50)]],
      notice_period: ['']
    });
    console.log('[CandidateProfile] Form initialized:', this.profileForm.value);
  }

  onSubmit(): void {
    console.log('[CandidateProfile] Submit triggered');
    if (this.profileForm.invalid) {
      console.warn('[CandidateProfile] Form is invalid:', this.profileForm.errors);
      this.showSnackBar('Please fill in all required fields correctly.', 'snackbar-warning');
      return;
    }

    const token = localStorage.getItem('access_token');
    console.log('[CandidateProfile] Retrieved token:', token);

    if (!token) {
      console.error('[CandidateProfile] No token found in localStorage.');
      this.showSnackBar('Authentication token not found.', 'snackbar-error');
      return;
    }

    this.isSubmitting = true;
    const payload = { ...this.profileForm.value };
    console.log('[CandidateProfile] Payload to send:', payload);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    console.log('[CandidateProfile] HTTP headers:', headers);

    this.http.post(this.apiUrl, payload, { headers }).subscribe({
      next: (response) => {
        console.log('[CandidateProfile] POST successful:', response);
        this.showSnackBar('Candidate profile saved successfully!', 'snackbar-success');
        this.isSubmitting = false;
        this.profileForm.reset();
        console.log('[CandidateProfile] Form reset after successful submit.');
      },
      error: (err) => {
        console.error('[CandidateProfile] POST failed:', err);
        this.showSnackBar('Failed to save profile.', 'snackbar-error');
        this.isSubmitting = false;
      }
    });
  }

  private showSnackBar(message: string, panelClass: string): void {
    console.log(`[CandidateProfile] Showing snackbar: "${message}" with class "${panelClass}"`);
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}

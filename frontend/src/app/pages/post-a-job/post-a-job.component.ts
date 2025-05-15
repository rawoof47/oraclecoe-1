import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { JobPostService } from '../../services/job-post.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
  selector: 'app-post-a-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
  ],
  templateUrl: './post-a-job.component.html',
  styleUrl: './post-a-job.component.scss',
})
export class PostAJobComponent implements OnInit {
  jobForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private snackBar: MatSnackBar
  ) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      location: [''],
      modulesRequired: [''],
      skillsRequired: ['', Validators.required],
      certificationsRequired: [''],
      experienceMin: [null, Validators.required],
      experienceMax: [null, Validators.required],
      employmentType: ['', Validators.required],
      compensationRange: ['', Validators.required],
      jobDescription: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      applicationDeadline: [''],
      recruiterId: ['', Validators.required],
      createdBy: ['']
    });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const recruiterId = user?.id;
    const role = user?.role;

    if (role === 'recruiter' && recruiterId) {
      this.jobForm.patchValue({ recruiterId });
    } else {
      console.warn('⚠️ No recruiter ID found in localStorage. Ensure user is logged in.');
    }
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.snackBar.open('Please fill in the required fields.', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    this.loading = true;

    const formValues = this.jobForm.value;

    const jobPostPayload = {
      ...formValues,
      experienceMin: Number(formValues.experienceMin),
      experienceMax: Number(formValues.experienceMax),
      applicationDeadline: formValues.applicationDeadline
        ? new Date(formValues.applicationDeadline).toISOString()
        : undefined,
      updatedBy: undefined
    };

    this.jobPostService.create(jobPostPayload).subscribe({
      next: () => {
        this.snackBar.open('Job posted successfully!', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.jobForm.reset();
        this.jobForm.patchValue({ recruiterId: formValues.recruiterId });
      },
      error: (err) => {
        console.error('❌ Job post failed:', err);
        this.snackBar.open(
          err?.error?.message || 'Failed to post job. Please try again.',
          'Close',
          {
            duration: 4000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';

import { JobPostService } from '../../services/job-post.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

interface Skill {
  id: string;
  name: string;
}

interface JobPost {
  id?: string;
  recruiter_id: string;
}

interface JobPostResponse {
  message: string;
  data: JobPost;
}

@Component({
  selector: 'app-post-a-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgSelectModule,
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
  moduleTypeahead = new Subject<string>();

  functionalSkills: Skill[] = [];
  technicalSkills: Skill[] = [];
  oracleMiddlewareSkills: Skill[] = [];
  reportingSkills: Skill[] = [];

  workModeOptions = ['Remote', 'On-site', 'Hybrid'];

  constructor(
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private snackBar: MatSnackBar
  ) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      location: [''],
      certificationsRequired: [''],
      experienceMin: [null, [Validators.required, Validators.min(0)]],
      experienceMax: [null, [Validators.required, Validators.min(0)]],
      employmentType: ['', Validators.required],
      compensationRange: ['', Validators.required],
      workMode: ['', Validators.required],
      jobDescription: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      applicationDeadline: [''],
      recruiterId: ['', Validators.required],
      createdBy: [''],

      // ✅ New fields added
      roleSummary: ['', Validators.required],
      preferredQualifications: [''],
      whatWeOffer: [''],
      howToApply: [''],

      // ✅ Skill selections
      functionalSkills: [[]],
      technicalSkills: [[]],
      oracleMiddlewareSkills: [[]],
      reportingSkills: [[]],
    });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const recruiterId = user?.id;
    const role = user?.role;

    if (role === 'recruiter' && recruiterId) {
      this.jobForm.patchValue({ recruiterId });
    } else {
      console.warn('⚠️ No recruiter ID found. Ensure recruiter is logged in.');
    }

    this.loadSkillsByCategory();
  }

  loadSkillsByCategory(): void {
    this.loadSkillSet('612222a1-791a-4125-be8d-1d86808a37bf', 'functionalSkills');
    this.loadSkillSet('b9677d69-356f-11f0-bd34-80ce6232908a', 'technicalSkills');
    this.loadSkillSet('0ec31fb0-3591-11f0-ae4b-80ce6232908a', 'oracleMiddlewareSkills');
    this.loadSkillSet('843a8e1d-3591-11f0-ae4b-80ce6232908a', 'reportingSkills');
  }

  loadSkillSet(
    categoryId: string,
    property: 'functionalSkills' | 'technicalSkills' | 'oracleMiddlewareSkills' | 'reportingSkills'
  ): void {
    this.jobPostService.getFunctionalSkills(categoryId).subscribe({
      next: (data: Skill[]) => {
        this[property] = data || [];
      },
      error: (err) => {
        console.error(`❌ Failed to load skills for ${property}:`, err);
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.snackBar.open('Please fill in the required fields.', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;
    const formValues = this.jobForm.value;

    const jobPostPayload = {
      ...formValues,
      functionalSkills: formValues.functionalSkills.map((s: Skill) => s.name),
      technicalSkills: formValues.technicalSkills.map((s: Skill) => s.name),
      oracleMiddlewareSkills: formValues.oracleMiddlewareSkills.map((s: Skill) => s.name),
      reportingSkills: formValues.reportingSkills.map((s: Skill) => s.name),
      experienceMin: Number(formValues.experienceMin),
      experienceMax: Number(formValues.experienceMax),
      applicationDeadline: formValues.applicationDeadline
        ? new Date(formValues.applicationDeadline).toISOString()
        : undefined,
      updatedBy: undefined,
    };

    const selectedSkillIds: string[] = [
      ...formValues.functionalSkills.map((s: Skill) => s?.id).filter(Boolean),
      ...formValues.technicalSkills.map((s: Skill) => s?.id).filter(Boolean),
      ...formValues.oracleMiddlewareSkills.map((s: Skill) => s?.id).filter(Boolean),
      ...formValues.reportingSkills.map((s: Skill) => s?.id).filter(Boolean),
    ];

    this.jobPostService.create(jobPostPayload).subscribe({
      next: (response: JobPostResponse) => {
        const jobPostId = response.data?.id;

        if (!jobPostId) {
          console.error('❌ Job post created, but no ID was returned.');
          this.snackBar.open('Job created, but failed to save skills.', 'Close', {
            duration: 4000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.loading = false;
          return;
        }

        if (!selectedSkillIds.length) {
          this.showSuccessMessage();
          return;
        }

        this.jobPostService.saveSkills(jobPostId, selectedSkillIds).subscribe({
          next: () => this.showSuccessMessage(),
          error: (err) => {
            console.error('❌ Skill assignment failed:', err);
            this.snackBar.open('Job posted, but skill saving failed.', 'Close', {
              duration: 4000,
              panelClass: 'snackbar-error',
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.loading = false;
          },
        });
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
            verticalPosition: 'top',
          }
        );
        this.loading = false;
      },
    });
  }

  private showSuccessMessage() {
    this.snackBar.open('✅ Job and skills saved successfully!', 'Close', {
      duration: 3000,
      panelClass: 'snackbar-success',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    this.jobForm.reset();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.jobForm.patchValue({ recruiterId: user?.id });
    this.loading = false;
  }
}

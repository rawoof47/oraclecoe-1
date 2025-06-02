import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpHeaders } from '@angular/common/http';
import { CandidateProfileService } from '../../services/candidate-profile.service';

interface Skill {
  id: number;
  name: string;
}

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgSelectModule
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private profileService = inject(CandidateProfileService);

  profileForm!: FormGroup;
  isSubmitting = false;

  // Skill categories
  functionalSkills: Skill[] = [];
  technicalSkills: Skill[] = [];
  oracleMiddlewareSkills: Skill[] = [];
  reportingSkills: Skill[] = [];

  // Category IDs (must match backend)
  private readonly SKILL_CATEGORIES = {
    functional: '1',
    technical: '2',
    oracleMiddleware: '3',
    reporting: '4'
  };

  ngOnInit(): void {
    this.initializeForm();
    this.loadSkillsByCategories();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      about_me: [''],
      professional_summary: [''],
      social_links: [''],
      resume_link: ['', Validators.pattern('https?://.+')],
      education: [''],
      experience_years: [null, [Validators.min(0), Validators.max(50)]],
      notice_period: [''],

      functionalSkills: [[]],
      technicalSkills: [[]],
      oracleMiddlewareSkills: [[]],
      reportingSkills: [[]]
    });
  }

  loadSkillsByCategories(): void {
    this.profileService.getSkillsByCategory(this.SKILL_CATEGORIES.functional).subscribe({
      next: (skills) => (this.functionalSkills = skills),
      error: () => this.showSnackBar('Failed to load functional skills.', 'snackbar-error')
    });

    this.profileService.getSkillsByCategory(this.SKILL_CATEGORIES.technical).subscribe({
      next: (skills) => (this.technicalSkills = skills),
      error: () => this.showSnackBar('Failed to load technical skills.', 'snackbar-error')
    });

    this.profileService.getSkillsByCategory(this.SKILL_CATEGORIES.oracleMiddleware).subscribe({
      next: (skills) => (this.oracleMiddlewareSkills = skills),
      error: () => this.showSnackBar('Failed to load Oracle Middleware skills.', 'snackbar-error')
    });

    this.profileService.getSkillsByCategory(this.SKILL_CATEGORIES.reporting).subscribe({
      next: (skills) => (this.reportingSkills = skills),
      error: () => this.showSnackBar('Failed to load reporting skills.', 'snackbar-error')
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.showSnackBar('Please fill in all required fields correctly.', 'snackbar-warning');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.showSnackBar('Authentication token not found.', 'snackbar-error');
      return;
    }

    this.isSubmitting = true;

    const formValues = this.profileForm.value;
    const allSkillIds: number[] = [
      ...formValues.functionalSkills.map((s: Skill) => s.id),
      ...formValues.technicalSkills.map((s: Skill) => s.id),
      ...formValues.oracleMiddlewareSkills.map((s: Skill) => s.id),
      ...formValues.reportingSkills.map((s: Skill) => s.id)
    ];

    const payload = {
      about_me: formValues.about_me,
      professional_summary: formValues.professional_summary,
      social_links: formValues.social_links,
      resume_link: formValues.resume_link,
      education: formValues.education,
      experience_years: formValues.experience_years,
      notice_period: formValues.notice_period,
      skill_ids: allSkillIds
    };

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.profileService.saveCandidateProfile(payload).subscribe({
      next: () => {
        this.showSnackBar('Candidate profile saved successfully!', 'snackbar-success');
        this.isSubmitting = false;
        this.profileForm.reset();
      },
      error: (err) => {
        console.error('[CandidateProfile] POST failed:', err);
        this.showSnackBar('Failed to save profile.', 'snackbar-error');
        this.isSubmitting = false;
      }
    });
  }

  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}

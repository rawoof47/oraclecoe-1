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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)
  // Certification categories
  financialCertifications: Skill[] = [];
  hcmCertifications: Skill[] = [];
  scmCertifications: Skill[] = [];
  cxCertifications: Skill[] = [];

  // Category IDs (must match backend)
  private readonly SKILL_CATEGORIES = {
    functional: '612222a1-791a-4125-be8d-1d86808a37bf',
    technical: 'b9677d69-356f-11f0-bd34-80ce6232908a',
    oracleMiddleware: '0ec31fb0-3591-11f0-ae4b-80ce6232908a',
    reporting: '843a8e1d-3591-11f0-ae4b-80ce6232908a'
  };

  private readonly CERTIFICATION_CATEGORIES = {
    financialCertifications: 'ed7c50c7-36d3-11f0-bfce-80ce6232908a',
    hcmCertifications: 'ed7c5c88-36d3-11f0-bfce-80ce6232908a',
    scmCertifications: 'ed7c5da6-36d3-11f0-bfce-80ce6232908a',
    cxCertifications: 'ed7c5e82-36d3-11f0-bfce-80ce6232908a'
  };
<<<<<<< HEAD
=======
  @ViewChild('skillsDropdown') skillsDropdown!: ElementRef;
  @ViewChild('certsDropdown') certsDropdown!: ElementRef;
>>>>>>> 729a3cd (feat:(profile page))
=======
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)

  ngOnInit(): void {
    this.initializeForm();
<<<<<<< HEAD
<<<<<<< HEAD
    this.loadSkillsByCategories();
    this.loadCertificationsByCategories();
=======
    this.fetchSkillsAndCertifications();
>>>>>>> 729a3cd (feat:(profile page))
=======
    this.loadSkillsByCategories();
    this.loadCertificationsByCategories();
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)

      functionalSkills: [[]],
      technicalSkills: [[]],
      oracleMiddlewareSkills: [[]],
      reportingSkills: [[]],

      financialCertifications: [[]],
      hcmCertifications: [[]],
      scmCertifications: [[]],
      cxCertifications: [[]]
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
<<<<<<< HEAD
=======
      skills: [[]],
      certifications: [[]],
>>>>>>> 729a3cd (feat:(profile page))
=======
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)
    });
  }

  loadCertificationsByCategories(): void {
    this.profileService.getCertificationsByCategory(this.CERTIFICATION_CATEGORIES.financialCertifications).subscribe({
      next: (certs) => {
        console.log('Financial Certifications:', certs); // 👈 Check this
        this.financialCertifications = certs;
      },
      error: () => this.showSnackBar('Failed to load financial certifications.', 'snackbar-error')
    });
  
    this.profileService.getCertificationsByCategory(this.CERTIFICATION_CATEGORIES.hcmCertifications).subscribe({
      next: (certs) => (this.hcmCertifications = certs),
      error: () => this.showSnackBar('Failed to load HCM certifications.', 'snackbar-error')
    });
  
    this.profileService.getCertificationsByCategory(this.CERTIFICATION_CATEGORIES.scmCertifications).subscribe({
      next: (certs) => (this.scmCertifications = certs),
      error: () => this.showSnackBar('Failed to load SCM certifications.', 'snackbar-error')
    });
  
    this.profileService.getCertificationsByCategory(this.CERTIFICATION_CATEGORIES.cxCertifications).subscribe({
      next: (certs) => (this.cxCertifications = certs),
      error: () => this.showSnackBar('Failed to load CX certifications.', 'snackbar-error')
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)
    const formValues = this.profileForm.value;

    // Combine all selected skill IDs
    const allSkillIds: number[] = [
      ...formValues.functionalSkills.map((s: Skill) => s.id),
      ...formValues.technicalSkills.map((s: Skill) => s.id),
      ...formValues.oracleMiddlewareSkills.map((s: Skill) => s.id),
      ...formValues.reportingSkills.map((s: Skill) => s.id)
    ];

    // Combine all selected certification IDs
    const allCertificationIds: number[] = [
      ...formValues.financialCertifications.map((c: Skill) => c.id),
      ...formValues.hcmCertifications.map((c: Skill) => c.id),
      ...formValues.scmCertifications.map((c: Skill) => c.id),
      ...formValues.cxCertifications.map((c: Skill) => c.id)
    ];

    const payload = {
      about_me: formValues.about_me,
      professional_summary: formValues.professional_summary,
      social_links: formValues.social_links,
      resume_link: formValues.resume_link,
      education: formValues.education,
      experience_years: formValues.experience_years,
      notice_period: formValues.notice_period,
      skill_ids: allSkillIds,
      certification_ids: allCertificationIds
    };

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.profileService.saveCandidateProfile(payload).subscribe({
<<<<<<< HEAD
=======
    this.profileService.updateUserName(this.userId, firstName, lastName, middleName).subscribe({
>>>>>>> 729a3cd (feat:(profile page))
=======
>>>>>>> 409f254 (Recovered recruiter-profile component and related files)
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

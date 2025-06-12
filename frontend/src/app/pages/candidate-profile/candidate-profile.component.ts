import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';

import { CandidateProfileService } from '../../services/candidate-profile.service';
import { AuthStateService } from '../../services/auth-state.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CandidateProfile } from '../../auth/models/candidate-profile.model';
import {
  Certification,
  Skill,
  SKILL_CATEGORIES,
  CERT_CATEGORIES,
  loadSkillsAndCertifications,
  toggleSkill,
  toggleCertification,
  getSkillsLabel,
  getCertificationsLabel,
} from './candidate-skills-certs.helper';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgSelectModule,
    BackToTopComponent,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss'],
})
export class CandidateProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private profileService = inject(CandidateProfileService);
  private authState = inject(AuthStateService);

  profileForm!: FormGroup;
  isSubmitting = false;
  userId: string | null = null;

  groupedSkills: any[] = [];
  groupedCertifications: any[] = [];
  selectedSkills: Skill[] = [];
  selectedCertifications: Certification[] = [];
  showSkillsDropdown = false;
  showCertsDropdown = false;

<<<<<<< HEAD
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
=======
  @ViewChild('skillsDropdown') skillsDropdown!: ElementRef;
  @ViewChild('certsDropdown') certsDropdown!: ElementRef;
>>>>>>> 729a3cd (feat:(profile page))

  ngOnInit(): void {
    this.userId = this.authState.getCurrentUserId();
    this.initializeForm();
<<<<<<< HEAD
    this.loadSkillsByCategories();
    this.loadCertificationsByCategories();
=======
    this.fetchSkillsAndCertifications();
>>>>>>> 729a3cd (feat:(profile page))
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(10)]],
      middleName: ['', [Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.maxLength(10)]],
      about_me: [''],
      professional_summary: [''],
      social_links: [''],
      resume_link: ['', Validators.pattern('https?://.+')],
      education: [''],
      experience_years: [null, [Validators.min(0), Validators.max(50)]],
      notice_period: [''],
<<<<<<< HEAD

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
=======
      skills: [[]],
      certifications: [[]],
>>>>>>> 729a3cd (feat:(profile page))
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
      this.showSnackBar('Please fill required fields correctly', 'snackbar-error');
      return;
    }

    if (!this.userId) {
      this.showSnackBar('User not authenticated', 'snackbar-error');
      return;
    }

    this.isSubmitting = true;
    const { firstName, middleName, lastName, ...rest } = this.profileForm.value;

<<<<<<< HEAD
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
=======
    this.profileService.updateUserName(this.userId, firstName, lastName, middleName).subscribe({
>>>>>>> 729a3cd (feat:(profile page))
      next: () => {
        const profileData: CandidateProfile = {
          about_me: rest.about_me,
          professional_summary: rest.professional_summary,
          social_links: rest.social_links,
          resume_link: rest.resume_link,
          education: rest.education,
          experience_years: rest.experience_years,
          notice_period: rest.notice_period,
        };

        this.profileService.saveCandidateProfile(profileData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showSnackBar('Profile saved successfully!', 'snackbar-success');
          },
          error: () => {
            this.isSubmitting = false;
            this.showSnackBar('Failed to save profile', 'snackbar-error');
          },
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.showSnackBar('Failed to update name', 'snackbar-error');
      },
    });
  }

  fetchSkillsAndCertifications(): void {
    loadSkillsAndCertifications(
      this.profileService,
      (skills, certs) => {
        this.groupedSkills = skills;
        this.groupedCertifications = certs;
      },
      () => {
        this.showSnackBar('Failed to load skills or certifications.', 'snackbar-error');
      }
    );
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  toggleCertsDropdown(): void {
    this.showCertsDropdown = !this.showCertsDropdown;
  }

  onSkillChange(skill: Skill): void {
    this.selectedSkills = toggleSkill(skill, this.selectedSkills);
    this.updateFormSelections();
  }

  onCertChange(cert: Certification): void {
    this.selectedCertifications = toggleCertification(cert, this.selectedCertifications);
    this.updateFormSelections();
  }

  updateFormSelections(): void {
    this.profileForm.patchValue({
      skills: this.selectedSkills.map((s) => s.id),
      certifications: this.selectedCertifications.map((c) => c.id),
    });
  }

  getSkillsDropdownLabel(): string {
    return getSkillsLabel(this.selectedSkills);
  }

  getCertsDropdownLabel(): string {
    return getCertificationsLabel(this.selectedCertifications);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.showSkillsDropdown &&
      this.skillsDropdown &&
      !this.skillsDropdown.nativeElement.contains(event.target)
    ) {
      this.showSkillsDropdown = false;
    }

    if (
      this.showCertsDropdown &&
      this.certsDropdown &&
      !this.certsDropdown.nativeElement.contains(event.target)
    ) {
      this.showCertsDropdown = false;
    }
  }

  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}

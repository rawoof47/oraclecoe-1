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
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router'; // Added Router import

import { CandidateProfileService } from '../../services/candidate-profile.service';
import { AuthStateService } from '../../services/auth-state.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CandidateProfile } from '../../auth/models/candidate-profile.model';
import {
  Certification,
  Skill,
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
  private router = inject(Router); // Injected Router

  profileForm!: FormGroup;
  isSubmitting = false;
  userId: string | null = null;

  groupedSkills: any[] = [];
  groupedCertifications: any[] = [];
  selectedSkills: Skill[] = [];
  selectedCertifications: Certification[] = [];
  showSkillsDropdown = false;
  showCertsDropdown = false;
  profileSkillIds: string[] = [];
  profileCertificationIds: string[] = [];

<<<<<<< HEAD
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
=======
  @ViewChild('skillsDropdown') skillsDropdown!: ElementRef;
  @ViewChild('certsDropdown') certsDropdown!: ElementRef;
>>>>>>> c438b465a5cb38c7dc85cddd688e58c87b5ede81

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
    this.userId = this.authState.getCurrentUserId();
    this.initializeForm();
<<<<<<< HEAD
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
=======
    this.loadUserData();
    this.loadCandidateProfile();
    this.fetchSkillsAndCertifications();
>>>>>>> c438b465a5cb38c7dc85cddd688e58c87b5ede81
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],  
      middleName: ['', [Validators.maxLength(50)]],                      
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      mobileNumber: ['', [Validators.maxLength(20)]],
      gender: [''],   
      about_me: [''],
      professional_summary: [''],
      social_links: [''],
      resume_link: ['', Validators.pattern('https?://.+')],
      education: [''],
      experience_years: [null, [Validators.min(0), Validators.max(50)]],
      notice_period: [''],
<<<<<<< HEAD
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
=======
      skills: [[]],
      certifications: [[]],
>>>>>>> c438b465a5cb38c7dc85cddd688e58c87b5ede81
    });
  }

  private loadUserData(): void {
    if (!this.userId) return;
    
    this.profileService.getUser(this.userId).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          firstName: user.first_name,
          middleName: user.middle_name || '',
          lastName: user.last_name,
          email: user.email,
          mobileNumber: user.mobile_number || ''
        });
      },
      error: (error) => {
        console.error('Failed to load user data', error);
      }
    });
  }

  private loadCandidateProfile(): void {
    if (!this.userId) return;
    
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          gender: profile.gender || '',
          about_me: profile.about_me || '',
          professional_summary: profile.professional_summary || '',
          social_links: profile.social_links || '',
          resume_link: profile.resume_link || '',
          education: profile.education || '',
          experience_years: profile.experience_years || null,
          notice_period: profile.notice_period || '',
        });

<<<<<<< HEAD
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
=======
        this.profileSkillIds = profile.skill_ids || [];
        this.profileCertificationIds = profile.certification_ids || [];
      },
      error: (error) => {
        console.error('Failed to load candidate profile', error);
      }
>>>>>>> c438b465a5cb38c7dc85cddd688e58c87b5ede81
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
    const { firstName, middleName, lastName, email, mobileNumber, ...rest } = this.profileForm.value;

<<<<<<< HEAD
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
=======
    this.profileService.updateUserContactInfo(this.userId, email, mobileNumber).subscribe({
>>>>>>> c438b465a5cb38c7dc85cddd688e58c87b5ede81
      next: () => {
        this.profileService.updateUserName(this.userId!, firstName, lastName, middleName).subscribe({
          next: () => {
            this.saveSkillsAndCerts().then(() => {
              const profileData = {
                ...rest,
                gender: this.profileForm.value.gender,
              };
              delete profileData.skills;
              delete profileData.certifications;

              this.profileService.saveCandidateProfile(profileData).subscribe({
                next: () => {
                  this.isSubmitting = false;
                  this.showSnackBar('Profile saved successfully!', 'snackbar-success');
                  // Added redirection to dashboard
                  this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                  this.isSubmitting = false;
                  console.error('Profile save error:', error);
                  this.showSnackBar('Failed to save profile', 'snackbar-error');
                }
              });
            }).catch(error => {
              this.isSubmitting = false;
              console.error('Skills/certs save error:', error);
              this.showSnackBar('Failed to save skills or certifications', 'snackbar-error');
            });
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Name update error:', error);
            this.showSnackBar('Failed to update name', 'snackbar-error');
          }
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Contact info update error:', error);
        
        let errorMsg = 'Failed to update contact information';
        if (error.status === 409) {
          errorMsg = 'Email already exists';
        }
        
        this.showSnackBar(errorMsg, 'snackbar-error');
      }
    });
  }

  private async saveSkillsAndCerts(): Promise<void> {
    const skillIds = this.selectedSkills.map(skill => skill.id);
    const certIds = this.selectedCertifications.map(cert => cert.id);

    await lastValueFrom(
      this.profileService.saveCandidateSkills(this.userId!, skillIds)
    );

    await lastValueFrom(
      this.profileService.saveCandidateCertifications(this.userId!, certIds)
    );
  }

  fetchSkillsAndCertifications(): void {
    loadSkillsAndCertifications(
      this.profileService,
      (skills, certs) => {
        this.groupedSkills = skills;
        this.groupedCertifications = certs;
        this.setInitialSelections();
      },
      () => {
        this.showSnackBar('Failed to load skills or certifications.', 'snackbar-error');
      }
    );
  }

  private setInitialSelections(): void {
    this.groupedSkills.forEach(group => {
      group.items.forEach((skill: Skill) => {
        if (this.profileSkillIds.includes(skill.id)) {
          this.selectedSkills = toggleSkill(skill, this.selectedSkills);
        }
      });
    });

    this.groupedCertifications.forEach(group => {
      group.items.forEach((cert: Certification) => {
        if (this.profileCertificationIds.includes(cert.id)) {
          this.selectedCertifications = toggleCertification(cert, this.selectedCertifications);
        }
      });
    });

    this.updateFormSelections();
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
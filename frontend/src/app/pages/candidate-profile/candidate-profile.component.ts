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
import { Router } from '@angular/router';

import { CandidateProfileService } from '../../services/candidate-profile.service';
import { AuthStateService } from '../../services/auth-state.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CandidateProfile } from '../../auth/models/candidate-profile.model';
import { CandidateSidebarComponent } from '../../common/candidate-sidebar/candidate-sidebar.component';
import {
  Certification,
  Skill,
  loadSkillsAndCertifications,
  toggleSkill,
  toggleCertification,
  getSkillsLabel,
  getCertificationsLabel,
  Degree,
  loadDegrees,
  toggleDegree,
  getDegreesLabel,
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
    CandidateSidebarComponent,
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss'],
})
export class CandidateProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private profileService = inject(CandidateProfileService);
  private authState = inject(AuthStateService);
  private router = inject(Router);

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

  groupedDegrees: any[] = [];
  selectedDegrees: Degree[] = [];
  showDegreesDropdown = false;
  profileDegreeIds: string[] = [];
  years: number[] = [];

  @ViewChild('skillsDropdown') skillsDropdown!: ElementRef;
  @ViewChild('certsDropdown') certsDropdown!: ElementRef;
  @ViewChild('degreesDropdown') degreesDropdown!: ElementRef;

  ngOnInit(): void {
    this.userId = this.authState.getCurrentUserId();
    this.initializeForm();
    this.loadUserData();
    this.loadCandidateProfile();
    this.fetchSkillsAndCertifications();
    this.fetchDegrees();
    this.years = Array.from({ length: 5 }, (_, i) => 1980 + i);
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
      year_of_passing: [null],
      experience_years: [null, [Validators.min(0), Validators.max(50)]],
      notice_period: [''],
      skills: [[]],
      certifications: [[]],
      degrees: [[]],
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
          mobileNumber: user.mobile_number || '',
        });
      },
      error: (error) => {
        console.error('Failed to load user data', error);
      },
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
          
          experience_years: profile.experience_years || null,
          notice_period: profile.notice_period || '',
          year_of_passing: profile.year_of_passing || null, // Load year value
        });

        this.profileSkillIds = profile.skill_ids || [];
        this.profileCertificationIds = profile.certification_ids || [];
        this.profileDegreeIds = profile.degree_ids || [];
      },
      error: (error) => {
        console.error('Failed to load candidate profile', error);
      },
    });
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

  private fetchDegrees(): void {
    loadDegrees(
      this.profileService,
      (degrees) => {
        this.groupedDegrees = degrees;
        this.setInitialDegreeSelections();
      },
      () => {
        this.showSnackBar('Failed to load degrees.', 'snackbar-error');
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

  private setInitialDegreeSelections(): void {
    this.groupedDegrees.forEach(group => {
      group.items.forEach((degree: Degree) => {
        if (this.profileDegreeIds.includes(degree.id)) {
          this.selectedDegrees = toggleDegree(degree, this.selectedDegrees);
        }
      });
    });

    this.updateFormSelections();
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

    this.profileService.updateUserContactInfo(this.userId, email, mobileNumber).subscribe({
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
              delete profileData.degrees;

              this.profileService.saveCandidateProfile(profileData).subscribe({
                next: () => {
                  this.isSubmitting = false;
                  this.showSnackBar('Profile saved successfully!', 'snackbar-success');
                  this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                  this.isSubmitting = false;
                  console.error('Profile save error:', error);
                  this.showSnackBar('Failed to save profile', 'snackbar-error');
                },
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
          },
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        let errorMsg = 'Failed to update contact information';
        if (error.status === 409) errorMsg = 'Email already exists';
        this.showSnackBar(errorMsg, 'snackbar-error');
      },
    });
  }

  private async saveSkillsAndCerts(): Promise<void> {
    const skillIds = this.selectedSkills.map(skill => skill.id);
    const certIds = this.selectedCertifications.map(cert => cert.id);
    const degreeIds = this.selectedDegrees.map(degree => degree.id);

    await lastValueFrom(this.profileService.saveCandidateSkills(this.userId!, skillIds));
    await lastValueFrom(this.profileService.saveCandidateCertifications(this.userId!, certIds));
    await lastValueFrom(this.profileService.saveCandidateDegrees(this.userId!, degreeIds));
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  toggleCertsDropdown(): void {
    this.showCertsDropdown = !this.showCertsDropdown;
  }

  toggleDegreesDropdown(): void {
    this.showDegreesDropdown = !this.showDegreesDropdown;
  }

  onSkillChange(skill: Skill): void {
    this.selectedSkills = toggleSkill(skill, this.selectedSkills);
    this.updateFormSelections();
  }

  onCertChange(cert: Certification): void {
    this.selectedCertifications = toggleCertification(cert, this.selectedCertifications);
    this.updateFormSelections();
  }

  onDegreeChange(degree: Degree): void {
    this.selectedDegrees = toggleDegree(degree, this.selectedDegrees);
    this.updateFormSelections();
  }

  updateFormSelections(): void {
    this.profileForm.patchValue({
      skills: this.selectedSkills.map((s) => s.id),
      certifications: this.selectedCertifications.map((c) => c.id),
      degrees: this.selectedDegrees.map((d) => d.id),
    });
  }

  getSkillsDropdownLabel(): string {
    return getSkillsLabel(this.selectedSkills);
  }

  getCertsDropdownLabel(): string {
    return getCertificationsLabel(this.selectedCertifications);
  }

  getDegreesDropdownLabel(): string {
    return getDegreesLabel(this.selectedDegrees);
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

    if (
      this.showDegreesDropdown &&
      this.degreesDropdown &&
      !this.degreesDropdown.nativeElement.contains(event.target)
    ) {
      this.showDegreesDropdown = false;
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

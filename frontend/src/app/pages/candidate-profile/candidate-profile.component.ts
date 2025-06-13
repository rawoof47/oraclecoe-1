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
import { lastValueFrom } from 'rxjs'; // ✅ Added

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

  @ViewChild('skillsDropdown') skillsDropdown!: ElementRef;
  @ViewChild('certsDropdown') certsDropdown!: ElementRef;

  ngOnInit(): void {
    this.userId = this.authState.getCurrentUserId();
    this.initializeForm();
    this.fetchSkillsAndCertifications();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],  
    middleName: ['', [Validators.maxLength(50)]],                      
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    gender: [''],   
      about_me: [''],
      professional_summary: [''],
      social_links: [''],
      resume_link: ['', Validators.pattern('https?://.+')],
      education: [''],
      experience_years: [null, [Validators.min(0), Validators.max(50)]],
      notice_period: [''],
      skills: [[]],
      certifications: [[]],
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

    this.profileService.updateUserName(this.userId, firstName, lastName, middleName).subscribe({
      next: () => {
        // Save skills and certifications FIRST
        this.saveSkillsAndCerts().then(() => {
          // Now save the rest of the profile data
          const profileData = {
          ...rest,
          gender: this.profileForm.value.gender,
          
        };
          // Remove skills and certs from profile data
          delete profileData.skills;
          delete profileData.certifications;

          this.profileService.saveCandidateProfile(profileData).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.showSnackBar('Profile saved successfully!', 'snackbar-success');
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

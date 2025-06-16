// single-resume.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { AuthStateService } from '../../services/auth-state.service';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';

@Component({
  selector: 'app-single-resume',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
    LinkifyPipe
  ],
  templateUrl: './single-resume.component.html',
  styleUrls: ['./single-resume.component.scss']
})
export class SingleResumeComponent implements OnInit {
  candidateProfile: any;
  user: any;
  skills: string[] = [];
  certifications: string[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private profileService: CandidateProfileService,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData() {
    const userId = this.authState.getCurrentUser()?.id;
    
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    forkJoin({
      profile: this.profileService.getMyProfile(),
      user: this.profileService.getUser(userId),
      skills: this.profileService.getCandidateSkills(userId),
      certifications: this.profileService.getCandidateCertifications(userId)
    })
    .pipe(
      catchError(error => {
        console.error('Error loading data:', error);
        this.errorMessage = 'Failed to load profile data';
        this.isLoading = false;
        return [];
      })
    )
    .subscribe(({ profile, user, skills, certifications }) => {
      this.candidateProfile = profile;
      this.user = user;
      this.skills = skills;
      this.certifications = certifications;
      this.isLoading = false;
    });
  }
}
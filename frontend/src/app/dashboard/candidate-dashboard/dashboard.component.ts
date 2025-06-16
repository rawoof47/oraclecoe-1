import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CandidateSidebarComponent } from '../../common/candidate-sidebar/candidate-sidebar.component';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { forkJoin } from 'rxjs';
import { AuthStateService } from '../../services/auth-state.service';

export interface CandidateCertification {
  certification: {
    certification_name: string;
    description: string;
  };
}

export interface CandidateProfile {
  about_me: string;
  professional_summary: string;
  social_links: string;
  experience_years: number;
  notice_period: string;
  resume_link: string;
  education: string;
  skills?: string[];
  certifications?: { certification_name: string }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgClass,
    NgIf,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
    CandidateSidebarComponent // ✅ Include sidebar component
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  profile: CandidateProfile | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private profileService: CandidateProfileService,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    this.fetchCandidateProfile();
  }

  fetchCandidateProfile(): void {
    this.isLoading = true;
    const userId = this.authState.getCurrentUserId();

    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    forkJoin({
      profile: this.profileService.getMyProfile(),
      skills: this.profileService.getCandidateSkills(userId),
      certifications: this.profileService.getCandidateCertifications(userId)
    }).subscribe({
      next: (response) => {
        this.profile = {
          ...response.profile,
          skills: response.skills,
          certifications: response.certifications
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch data', err);
        this.error = 'Failed to load profile data';
        this.isLoading = false;
      }
    });
  }

  parseLinks(links: string): string[] {
    if (!links) return [];

    try {
      const parsed = JSON.parse(links);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [links];
    }
  }
}

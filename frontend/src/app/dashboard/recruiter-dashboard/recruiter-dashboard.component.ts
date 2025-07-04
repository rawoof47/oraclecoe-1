import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RecruiterSidebarComponent } from '../../common/recruiter-sidebar/recruiter-sidebar.component';

import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { JobPostService } from '../../services/job-post.service';
import { ApplicationService } from '../../services/application.service'; // ✅ Added import

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    RecruiterSidebarComponent
  ],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent implements OnInit {
  profileData: any = null;
  isLoading = true;
  error: string | null = null;

  stats = {
    postedJobs: 0,
    applications: 0,
    shortlisted: 0,
    rejected: 0
  };

  constructor(
    private profileService: RecruiterProfileService,
    private jobPostService: JobPostService,
    private applicationService: ApplicationService // ✅ Injected service
  ) {}

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profileData = profile;
        this.fetchRecruiterStats(profile.user_id);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch profile data:', err);
        this.error = 'Failed to load profile data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  fetchRecruiterStats(recruiterId: string): void {
    this.jobPostService.getByRecruiter(recruiterId).subscribe({
      next: (response) => {
        this.stats.postedJobs = response.data.length;
        const jobIds = response.data.map((job: any) => job.id);

        if (jobIds.length > 0) {
          this.jobPostService.getApplicationsCountByJobIds(jobIds).subscribe({
            next: (counts) => {
              this.stats.applications = Object.values(counts).reduce(
                (sum, count) => sum + count, 0
              );
            },
            error: (err) => {
              console.error('Failed to fetch application counts:', err);
            }
          });
        }

        // ✅ Fetch shortlisted and rejected counts
        this.applicationService.getCountsByStatuses(recruiterId).subscribe({
          next: (counts) => {
            this.stats.shortlisted = counts.shortlisted || 0;
            this.stats.rejected = counts.rejected || 0;
          },
          error: (err) => {
            console.error('Failed to fetch status counts:', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch job posts:', err);
      }
    });
  }
}

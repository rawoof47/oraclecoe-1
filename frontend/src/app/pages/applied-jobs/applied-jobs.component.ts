import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Custom UI Components
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

// Services
import { JobPostService } from '../../services/job-post.service';
import { AuthStateService } from '../../services/auth-state.service';

// Models
import { JobPost } from '../../auth/models/job-post.model';
import { Application } from '../../auth/models/application.model';

// Extended model to use in the component
export interface AppliedJobPost extends JobPost {
  application_id: string;
  withdrawn: boolean;
  
}

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    PageBannerComponent,
    BackToTopComponent
  ],
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.scss']
})
export class AppliedJobsComponent implements OnInit {
  appliedJobPosts: AppliedJobPost[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobPostService: JobPostService,
    private authStateService: AuthStateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('[Init] AppliedJobsComponent initialized');
    this.loadAppliedJobs();
  }

  private loadAppliedJobs(): void {
    console.log('[loadAppliedJobs] Start fetching applied jobs...');
    const userId = this.authStateService.getCurrentUserId();
    console.log('[loadAppliedJobs] Current User ID:', userId);

    if (!userId) {
      this.error = 'User not authenticated.';
      this.loading = false;
      console.warn('[loadAppliedJobs] User not authenticated');
      return;
    }

    this.jobPostService.getApplicationsByUserFull(userId).pipe(
      map((applications: Application[]) => {
        console.log('[loadAppliedJobs] Raw applications received:', applications);

        const enriched: AppliedJobPost[] = applications
          .filter(app => app.job_post)
          .map(app => {
  console.log('[Application] app.id:', app.id, 'job_post:', app.job_post);
  if (!app.job_post) {
    console.warn('[Skipped] Application has no job_post:', app.id);
    return null;
  }

  const job: AppliedJobPost = {
    ...(app.job_post as JobPost),
    application_id: app.id,
    withdrawn: app.withdrawn
  };
  console.log('[Mapped] Enriched job:', job);
  return job;
}).filter((job): job is AppliedJobPost => job !== null)


        console.log('[loadAppliedJobs] Enriched job posts:', enriched);
        return enriched;
      }),
      catchError(err => {
        console.error('[loadAppliedJobs] Failed to load applications:', err);
        this.error = 'Failed to load applications';
        return of([]);
      })
    ).subscribe({
      next: (enrichedJobs) => {
        this.appliedJobPosts = enrichedJobs;
        this.loading = false;
        console.log('[loadAppliedJobs] Final applied job posts:', this.appliedJobPosts);
      },
      error: (err) => {
        console.error('[loadAppliedJobs] Unexpected error loading jobs:', err);
        this.error = 'Unexpected error occurred.';
        this.loading = false;
      }
    });
  }

  refreshAppliedJobs(): void {
    console.log('[refreshAppliedJobs] Refreshing jobs...');
    this.loading = true;
    this.error = null;
    this.appliedJobPosts = [];
    this.loadAppliedJobs();
  }

  formatPostedDate(dateStr?: string): string {
    console.log('[formatPostedDate] Input date:', dateStr);
    if (!dateStr) return 'Unknown date';

    const postedDate = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((+now - +postedDate) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 30) return `${diff} days ago`;

    const months = Math.floor(diff / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  withdrawApplication(applicationId: string): void {
    const userId = this.authStateService.getCurrentUserId();
    if (!userId) {
      console.warn('[withdrawApplication] No user ID found');
      return;
    }

    console.log('[withdrawApplication] Withdrawing application ID:', applicationId);
    this.jobPostService.withdrawApplication(applicationId, userId).subscribe({
      next: () => {
        console.log('[withdrawApplication] Successfully withdrew application:', applicationId);
        this.refreshAppliedJobs();
      },
      error: (err) => {
        console.error('[withdrawApplication] Error withdrawing application:', err);
      }
    });
  }
}

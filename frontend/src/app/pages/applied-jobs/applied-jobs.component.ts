import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of, switchMap, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Custom UI Components (standalone)
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

// Services
import { JobPostService } from '../../services/job-post.service';
import { AuthStateService } from '../../services/auth-state.service';

// Models
import { JobPost } from '../../auth/models/job-post.model';

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
  appliedJobPosts: JobPost[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobPostService: JobPostService,
    private authStateService: AuthStateService,
    private http: HttpClient
  ) {
    console.log('[Constructor] AppliedJobsComponent constructed');
  }

  ngOnInit(): void {
    console.log('[ngOnInit] AppliedJobsComponent initialized');
    this.loadAppliedJobs();
  }

  /**
   * 🔄 Loads applied jobs for the logged-in user using efficient single-fetch + filter strategy
   */
  private loadAppliedJobs(): void {
    console.log('[loadAppliedJobs] Start loading applied jobs...');

    const userId = this.authStateService.getCurrentUserId();
    console.log('[loadAppliedJobs] Retrieved userId from AuthStateService:', userId);

    if (!userId) {
      console.warn('[loadAppliedJobs] No authenticated user found.');
      this.error = 'User not authenticated.';
      this.loading = false;
      return;
    }

    this.jobPostService.getAppliedJobIdsByUser(userId).pipe(
      switchMap(jobIds => {
        console.log('[loadAppliedJobs] Received applied job IDs:', jobIds);

        if (!jobIds.length) {
          console.warn('[loadAppliedJobs] No applied jobs found for user.');
          return of([]);
        }

        const jobIdSet = new Set(jobIds); // for faster lookup

        // Fetch all jobs from backend
        return this.http.get<JobPost[]>('http://localhost:3000/jobs').pipe(
          map(allJobs => {
  const filteredJobs = allJobs.filter(job => job.id && jobIdSet.has(job.id));
  console.log('[loadAppliedJobs] Filtered applied jobs:', filteredJobs);
  return filteredJobs;
}),

          catchError(err => {
            console.error('[loadAppliedJobs] Error fetching all jobs:', err);
            this.error = 'Failed to fetch jobs data';
            return of([]);
          })
        );
      }),
      catchError(err => {
        console.error('[loadAppliedJobs] Error fetching applied job IDs:', err);
        this.error = 'Failed to fetch applied job IDs';
        return of([]);
      })
    ).subscribe({
      next: (appliedJobs) => {
        this.appliedJobPosts = appliedJobs;
        this.loading = false;
        console.log('[loadAppliedJobs] Applied jobs loaded successfully.');
      },
      error: (err) => {
        console.error('[loadAppliedJobs] Unexpected error:', err);
        this.error = 'Unexpected error loading applied jobs';
        this.loading = false;
      }
    });
  }

  /**
   * 🆕 Manually refresh the applied jobs list
   */
  refreshAppliedJobs(): void {
    console.log('[refreshAppliedJobs] Triggered');
    this.loading = true;
    this.error = null;
    this.appliedJobPosts = [];
    this.loadAppliedJobs();
  }

  /**
   * 🗓️ Formats the posted date into a human-readable string
   */
  formatPostedDate(dateStr?: string): string {
    console.log('[formatPostedDate] Input:', dateStr);

    if (!dateStr) {
      console.warn('[formatPostedDate] No date string provided.');
      return 'Unknown date';
    }

    const postedDate = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((+now - +postedDate) / (1000 * 60 * 60 * 24));
    console.log(`[formatPostedDate] Days difference from today: ${diff}`);

    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 30) return `${diff} days ago`;

    const months = Math.floor(diff / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
}

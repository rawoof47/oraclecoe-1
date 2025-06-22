import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { CandidateSidebarComponent } from '../../common/candidate-sidebar/candidate-sidebar.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

import { JobPostService } from '../../services/job-post.service';
import { AuthStateService } from '../../services/auth-state.service';
import { ApplicationStatusService } from '../../services/application-status.service';

import { JobPost } from '../../auth/models/job-post.model';
import { Application } from '../../auth/models/application.model';

import { APPLICATION_STATUS, STATUS_LABELS } from '../../shared/constants/constants';

export interface AppliedJobPost extends JobPost {
  application_id: string;
  status_id: string;
  status: string;
  withdrawn: boolean;
  withdrawal_reason?: string;
  applied_date: string;
  withdrawn_date?: string;
  job_number: number; // Add this line
}

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    PageBannerComponent,
    BackToTopComponent,
    CandidateSidebarComponent
  ],
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.scss']
})
export class AppliedJobsComponent implements OnInit {
  appliedJobPosts: AppliedJobPost[] = [];
  loading = true;
  error: string | null = null;

  showWithdrawModal = false;
  showReasonModal = false;
  currentApplicationId: string | null = null;
  currentJobId: string | null = null;
  currentWithdrawalReason = '';
  viewReasonText = '';

  shortlistedCount = 0;
  rejectedCount = 0;
  appliedCount = 0;

  constructor(
    private jobPostService: JobPostService,
    private authStateService: AuthStateService,
    private http: HttpClient,
    private applicationStatusService: ApplicationStatusService
  ) {}

  ngOnInit(): void {
    console.log('[Init] AppliedJobsComponent initialized');
    this.loadAppliedJobs();
  }

  private mapStatus(statusId: string, withdrawn: boolean): string {
    if (withdrawn) return 'Withdrawn';
    return STATUS_LABELS[statusId] || statusId;
  }

  private updateCounts(): void {
    this.appliedCount = this.appliedJobPosts.filter(job =>
      job.status_id === APPLICATION_STATUS.APPLIED && !job.withdrawn
    ).length;

    this.shortlistedCount = this.appliedJobPosts.filter(job =>
      job.status_id === APPLICATION_STATUS.SHORTLISTED && !job.withdrawn
    ).length;

    this.rejectedCount = this.appliedJobPosts.filter(job =>
      job.status_id === APPLICATION_STATUS.REJECTED && !job.withdrawn
    ).length;

    console.log(`[Counts] Applied: ${this.appliedCount}, Shortlisted: ${this.shortlistedCount}, Rejected: ${this.rejectedCount}`);
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
            const job: AppliedJobPost = {
  ...(app.job_post as JobPost),
  job_number: (app.job_post as any).job_number, // Add this line
  application_id: app.id,
  status_id: app.application_status_id,
  status: this.mapStatus(app.application_status_id, !!app.withdrawn),
  withdrawn: !!app.withdrawn,
  withdrawal_reason: app.withdrawal_reason,
  applied_date: app.applied_on,
  withdrawn_date: app.updated_on
};

            console.log(`[Mapping] Job ID: ${job.id}, Status ID: ${job.status_id}, Status: ${job.status}`);
            return job;
          })
          .filter((job): job is AppliedJobPost => job !== null);

        return enriched;
      }),
      catchError(err => {
        console.error('[loadAppliedJobs] Failed to load applications:', err);
        this.error = 'Failed to load applications';
        return of([]);
      })
    ).subscribe({
      next: (enrichedJobs) => {
        console.log('[loadAppliedJobs] Enriched Jobs:', enrichedJobs);
        this.appliedJobPosts = enrichedJobs;
        this.updateCounts();
        this.loading = false;
      },
      error: (err) => {
        console.error('[loadAppliedJobs] Unexpected error loading jobs:', err);
        this.error = 'Unexpected error occurred.';
        this.loading = false;
      }
    });
  }

  refreshAppliedJobs(): void {
    this.loading = true;
    this.error = null;
    this.appliedJobPosts = [];
    this.loadAppliedJobs();
  }

  formatPostedDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('[formatPostedDate] Invalid date string:', dateStr);
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  openWithdrawModal(applicationId: string, jobId: string): void {
    this.currentApplicationId = applicationId;
    this.currentJobId = jobId;
    this.currentWithdrawalReason = '';
    this.showWithdrawModal = true;
  }

  openReasonModal(reason: string): void {
    this.viewReasonText = reason;
    this.showReasonModal = true;
  }

  closeModals(): void {
    this.showWithdrawModal = false;
    this.showReasonModal = false;
    this.currentApplicationId = null;
    this.currentJobId = null;
    this.currentWithdrawalReason = '';
    this.viewReasonText = '';
  }

  submitWithdrawal(): void {
    if (!this.currentApplicationId || !this.currentJobId || !this.currentWithdrawalReason.trim()) {
      return;
    }

    const userId = this.authStateService.getCurrentUserId();
    if (!userId) {
      console.warn('[submitWithdrawal] No user ID found');
      return;
    }

    this.jobPostService.withdrawApplication(
      this.currentApplicationId,
      userId,
      this.currentWithdrawalReason
    ).subscribe({
      next: () => {
        console.log('[submitWithdrawal] Successfully withdrew application:', this.currentApplicationId);
        this.applicationStatusService.updateStatus(this.currentJobId!, false);
        this.closeModals();
        this.refreshAppliedJobs();
      },
      error: (err) => {
        console.error('[submitWithdrawal] Error withdrawing application:', err);
        this.closeModals();
      }
    });
  }
}

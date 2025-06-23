import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Services and Models
import { JobPostService } from '../../services/job-post.service';
import { JobPost } from '../../auth/models/job-post.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Shared Components
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CompensationFormatPipe } from '../../shared/pipes/compensation-format.pipe';
import { RecruiterSidebarComponent  } from '../../common/recruiter-sidebar/recruiter-sidebar.component';

@Component({
  selector: 'app-posted-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
    CompensationFormatPipe,
    RecruiterSidebarComponent,
  ],
  templateUrl: './posted-jobs.component.html',
  styleUrls: ['./posted-jobs.component.scss'],
  providers: [DatePipe]
})
export class PostedJobsComponent implements OnInit {
  jobPosts: JobPost[] = [];
  loading = true;
  error: string | null = null;
  recruiterId: string | null = null;

  // ✅ Status IDs for toggle
  activeStatusId = '36f3301d-318e-11f0-aa4d-80ce6232908a';
  inactiveStatusId = '7f8a812f-4d10-11f0-8520-ac1f6bbcd360';

  constructor(
    private jobPostService: JobPostService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.recruiterId = user?.id;

    if (!this.recruiterId) {
      this.error = 'Recruiter not authenticated';
      this.loading = false;
      return;
    }

    this.fetchJobPosts();
  }

  // posted-jobs.component.ts
fetchJobPosts(): void {
  this.jobPostService.getByRecruiter(this.recruiterId!).subscribe({
    next: (response) => {
      // Sort jobs by created_at (newest first)
      this.jobPosts = (response.data || []).sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Descending order
      });

      const jobIds = this.jobPosts.map(job => job.id!);
      if (jobIds.length > 0) {
        this.jobPostService.getApplicationsCountByJobIds(jobIds).subscribe({
          next: (counts) => {
            this.jobPosts = this.jobPosts.map(job => ({
              ...job,
              applicationsCount: counts[job.id!] || 0
            }));
            this.loading = false;
          },
          error: () => {
            this.handleApplicationsError();
          }
        });
      } else {
        this.loading = false;
      }
    },
    error: () => {
      this.error = 'Failed to load job posts. Please try again later.';
      this.loading = false;
    }
  });
}

  private handleApplicationsError(): void {
    this.jobPosts = this.jobPosts.map(job => ({
      ...job,
      applicationsCount: 0
    }));
    this.loading = false;
  }

  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }

  viewApplicants(jobId: string): void {
    this.router.navigate(['/job-applicants', jobId]);
  }

  // ✅ Toggle Active/Inactive Status
  toggleJobStatus(job: JobPost): void {
    const newStatusId = job.status_id === this.activeStatusId 
      ? this.inactiveStatusId 
      : this.activeStatusId;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Status Change',
        message: `Are you sure you want to ${job.status_id === this.activeStatusId ? 'inactivate' : 'activate'} this job?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobPostService.updateStatus(job.id!, newStatusId).subscribe({
          next: () => {
            job.status_id = newStatusId;
          },
          error: () => {
            alert('Failed to update job status. Please try again.');
          }
        });
      }
    });
  }
}

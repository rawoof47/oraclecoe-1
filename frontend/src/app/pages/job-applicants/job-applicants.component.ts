import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostService } from '../../services/job-post.service';
import { AuthService } from '../../services/auth.service';
import { Applicant } from '../../auth/models/applicant.model';
import { lastValueFrom } from 'rxjs';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
  standalone: true,
  selector: 'app-job-applicants',
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss'],
  imports: [
    CommonModule,
    InitialsPipe,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent
  ]
})
export class JobApplicantsComponent implements OnInit {
  applicants: Applicant[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  statusMap: Record<string, string> = {
    '12c7f28f-3a21-11f0-8520-ac1f6bbcd360': 'Applied',
    '99e8ca42-4058-11f0-8520-ac1f6bbcd360': 'Withdrawn',
    'SHORTLISTED_STATUS_ID': 'Shortlisted',
    'REJECTED_STATUS_ID': 'Rejected'
  };

  constructor(
    private jobPostService: JobPostService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    console.log('[Init] Component initializing...');
    await this.loadApplicants();
  }

  async loadApplicants() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const recruiterId = currentUser?.id;
      if (!recruiterId) throw new Error('Recruiter ID not found');

      const applications = await lastValueFrom(
        this.jobPostService.getApplicationsByRecruiter(recruiterId)
      );

      if (!applications.length) {
        this.isLoading = false;
        return;
      }

      this.applicants = applications.map((app: any) => ({
        id: app.candidate_id,
        application_id: app.application_id,
        name: app.candidate_name || 'Unknown Candidate',
        email: 'Hidden for privacy',
        appliedDate: app.applied_on,
        status: this.mapStatus(app.status_id, app.withdrawn),
        status_id: app.status_id,
        job_id: app.job_id,
        job_title: app.job_title || 'Unknown Position',
        withdrawn: app.withdrawn,
        candidate_id: app.candidate_id,
        resumeUrl: null
      }));
    } catch (error) {
      console.error('[Error] Failed to load applicants:', error);
      this.errorMessage = 'Failed to load applicants. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  private mapStatus(statusId: string, withdrawn: boolean): string {
    if (withdrawn) return 'Withdrawn';
    return this.statusMap[statusId] || statusId;
  }

  updateStatus(applicationId: string, newStatusId: string) {
    console.log('[UpdateStatus] Updating status for application ID:', applicationId, 'to:', newStatusId);
    this.jobPostService.updateApplicationStatus(applicationId, newStatusId)
      .subscribe({
        next: () => {
          const applicant = this.applicants.find(a => a.application_id === applicationId);
          if (applicant) {
            applicant.status = this.mapStatus(newStatusId, false);
            applicant.status_id = newStatusId;
          }
        },
        error: (err) => {
          console.error('[UpdateStatus] Status update failed:', err);
          alert('Failed to update status. Please try again.');
        }
      });
  }
}

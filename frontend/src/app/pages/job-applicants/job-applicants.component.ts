
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobPostService } from '../../services/job-post.service';
import { AuthService } from '../../services/auth.service';
import { Applicant } from '../../auth/models/applicant.model';
import { lastValueFrom } from 'rxjs';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RecruiterSidebarComponent  } from '../../common/recruiter-sidebar/recruiter-sidebar.component';

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
    BackToTopComponent,
    RecruiterSidebarComponent,
  ]
})
export class JobApplicantsComponent implements OnInit {
  applicants: Applicant[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  jobId: string | null = null;
  
  // Snackbar properties
  showSnackbar = false;
  snackbarMessage = '';
  snackbarType: 'success' | 'error' = 'success';

  // ✅ For Modal
  selectedApplicant: any = null;

  statusMap: Record<string, string> = {
    '12c7f28f-3a21-11f0-8520-ac1f6bbcd360': 'Applied',
    '99e8ca42-4058-11f0-8520-ac1f6bbcd360': 'Withdrawn',
    'e8d0da93-452c-11f0-8520-ac1f6bbcd360': 'Shortlisted',
    'e8d0fb03-452c-11f0-8520-ac1f6bbcd360': 'Rejected'
  };

  constructor(
    private jobPostService: JobPostService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    console.log('[Init] Component initializing...');
    this.route.params.subscribe(async (params) => {
      this.jobId = params['jobId'] || null;
      await this.loadApplicants();
    });
  }

  async loadApplicants() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const recruiterId = currentUser?.id;
      if (!recruiterId) throw new Error('Recruiter ID not found');

      let applications = await lastValueFrom(
        this.jobPostService.getApplicationsByRecruiter(recruiterId)
      );

      if (this.jobId) {
        applications = applications.filter((app: any) => app.job_id === this.jobId);
      }

      if (!applications.length) {
        this.isLoading = false;
        return;
      }

      this.applicants = applications.map((app: any) => ({
        id: app.candidate_id,
        application_id: app.application_id,
        name: app.candidate_name || 'Unknown Candidate',
        appliedDate: app.applied_on,
        status: this.mapStatus(app.status_id, app.withdrawn),
        status_id: app.status_id,
        job_id: app.job_id,
        job_title: app.job_title || 'Unknown Position',
        withdrawn: app.withdrawn,
        candidate_id: app.candidate_id,
        resumeUrl: null,
        email: app.candidate_email,
        withdrawalReason: app.withdrawal_reason || null
      }));
    } catch (error) {
      console.error('[Error] Failed to load applicants:', error);
      this.errorMessage = 'Failed to load applicants. Please try again later.';
      this.showSnackbarMessage('Failed to load applicants', 'error');
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
            
            // Show snackbar based on action
            const message = newStatusId === 'e8d0da93-452c-11f0-8520-ac1f6bbcd360' 
              ? 'Applicant shortlisted successfully' 
              : 'Applicant rejected successfully';
              
            this.showSnackbarMessage(message, 'success');
          }
        },
        error: (err) => {
          console.error('[UpdateStatus] Status update failed:', err);
          this.showSnackbarMessage('Failed to update status. Please try again.', 'error');
        }
      });
  }

  // ✅ Open Withdrawal Reason Modal
  viewWithdrawalReason(applicant: any) {
    this.selectedApplicant = applicant;
  }

  // ✅ Close Modal
  closeReasonModal() {
    this.selectedApplicant = null;
  }
  
  // Show snackbar message
  showSnackbarMessage(message: string, type: 'success' | 'error') {
    this.snackbarMessage = message;
    this.snackbarType = type;
    this.showSnackbar = true;
    
    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000);
  }
}

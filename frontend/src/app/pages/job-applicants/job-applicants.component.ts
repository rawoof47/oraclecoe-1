import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPostService } from '../../services/job-post.service';
import { AuthService } from '../../services/auth.service';
import { Applicant } from '../../auth/models/applicant.model';
import { lastValueFrom } from 'rxjs';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RecruiterSidebarComponent } from '../../common/recruiter-sidebar/recruiter-sidebar.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-job-applicants',
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InitialsPipe,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    RecruiterSidebarComponent,
  ]
})
export class JobApplicantsComponent implements OnInit {
  applicants: Applicant[] = [];
  filteredApplicants: Applicant[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  jobId: string | null = null;
  statusFilter: string = 'all';
  searchTerm: string = '';

  autoApplyFilter = false;
  filterSource: string | null = null;

  pageTitle = 'Job Applicants';
  specificJobTitle: string | null = null;

  showSnackbar = false;
  snackbarMessage = '';
  snackbarType: 'success' | 'error' = 'success';

  selectedApplicant: any = null;

  statusMap: Record<string, string> = {
    '12c7f28f-3a21-11f0-8520-ac1f6bbcd360': 'Applied',
    '99e8ca42-4058-11f0-8520-ac1f6bbcd360': 'Withdrawn',
    'e8d0da93-452c-11f0-8520-ac1f6bbcd360': 'Shortlisted',
    'e8d0fb03-452c-11f0-8520-ac1f6bbcd360': 'Rejected'
  };

  dashboardStatusMap: Record<string, string> = {
    'applied': '12c7f28f-3a21-11f0-8520-ac1f6bbcd360',
    'shortlisted': 'e8d0da93-452c-11f0-8520-ac1f6bbcd360',
    'rejected': 'e8d0fb03-452c-11f0-8520-ac1f6bbcd360'
  };

  constructor(
    private jobPostService: JobPostService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('[Init] Component initializing...');

    // Get state from ActivatedRoute snapshot or fallback to history.state
    let state: any = this.route.snapshot.data['state'] || this.route.snapshot.paramMap.get('state');

    if (!state || typeof state !== 'object') {
      state = history.state;
    }

    console.log('[ProcessNavigationState] Received state:', state);

    if (state && state['statusFilter']) {
      const filter = state['statusFilter'];
      this.filterSource = state['filterSource'] || null;

      if (this.dashboardStatusMap[filter]) {
        this.statusFilter = this.dashboardStatusMap[filter];
        this.autoApplyFilter = true;
        console.log('[ProcessNavigationState] Setting statusFilter to:', this.statusFilter);
        console.log('[ProcessNavigationState] autoApplyFilter:', this.autoApplyFilter);
      }
    }

    this.route.params.subscribe(async (params) => {
      this.jobId = params['jobId'] || null;
      await this.loadApplicants();
      this.updatePageTitle();
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

      this.filterApplicants();

      if (this.jobId && !this.specificJobTitle && this.applicants.length > 0) {
        this.specificJobTitle = this.applicants[0].job_title;
        this.updatePageTitle();
      }

    } catch (error) {
      console.error('[Error] Failed to load applicants:', error);
      this.errorMessage = 'Failed to load applicants. Please try again later.';
      this.showSnackbarMessage('Failed to load applicants', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  filterApplicants() {
    let temp = [...this.applicants];

    if (this.statusFilter === 'withdrawn') {
      temp = temp.filter(a => a.withdrawn);
    } else if (this.statusFilter !== 'all') {
      temp = temp.filter(a =>
        a.status_id === this.statusFilter && !a.withdrawn
      );
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      temp = temp.filter(applicant =>
        applicant.name.toLowerCase().includes(term)
      );
    }

    this.filteredApplicants = temp;
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

            this.filterApplicants();

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

  viewWithdrawalReason(applicant: any) {
    this.selectedApplicant = applicant;
  }

  closeReasonModal() {
    this.selectedApplicant = null;
  }

  showSnackbarMessage(message: string, type: 'success' | 'error') {
    this.snackbarMessage = message;
    this.snackbarType = type;
    this.showSnackbar = true;

    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000);
  }

  updatePageTitle() {
    if (this.specificJobTitle) {
      this.pageTitle = `Applications for "${this.specificJobTitle}"`;
    } else if (this.jobId) {
      this.pageTitle = `Job #${this.jobId} Applicants`;
    } else {
      this.pageTitle = 'All Applications';
    }
  }

  clearFilter(): void {
    this.statusFilter = 'all';
    this.filterApplicants();
    this.autoApplyFilter = false;
    this.filterSource = null;
  }
}

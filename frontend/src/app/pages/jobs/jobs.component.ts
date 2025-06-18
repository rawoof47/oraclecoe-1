import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SkillFiltersComponent } from './filters/skills-filter/skills-filter.component';
import { AuthStateService } from '../../services/auth-state.service';
import { CompensationFormatPipe } from '../../shared/pipes/compensation-format.pipe';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
    FormsModule,
    NgSelectModule,
    CompensationFormatPipe,
    SkillFiltersComponent,
    MatSnackBarModule,
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  @ViewChild(SkillFiltersComponent) skillsFilter!: SkillFiltersComponent;

  jobs: any[] = [];
  allJobs: any[] = [];
  jobCount = 0;
  loading = true;
  error: string | null = null;
  userRole$!: Observable<string | null>;

  workModeOptions: string[] = ['Remote', 'On-site', 'Hybrid'];
  selectedWorkMode: string = '';

  employmentTypeOptions: string[] = [
    'Full Time / Regular',
    'Part Time / Freelance',
    'Contract',
    'Internship'
  ];
  selectedEmploymentTypes: string[] = [];

  noticePeriodOptions: string[] = [
    'Immediate',
    '< 1 Month',
    '1 Month',
    '2 Months',
    '3 Months'
  ];
  selectedNoticePeriod: string = '';

  searchTerm: string = '';
  searchKeyword: string = '';
  searchLocation: string = '';

  currentUserId: string | null = null;
  selectedSkillIds: string[] = [];
  selectedCertIds: string[] = [];
  filteredJobIdsFromSkills: string[] = [];

  appliedStatus: { [jobId: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    private authState: AuthStateService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authState.getCurrentUserId();
    this.userRole$ = this.authState.userRole$;
    this.fetchJobs();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  fetchJobs(): void {
    this.http.get<any[]>('http://localhost:3000/jobs').subscribe({
      next: (data) => {
        this.allJobs = data;
        this.jobs = data;
        this.jobCount = data.length;
        this.loading = false;
        this.checkAppliedStatuses();
      },
      error: () => {
        this.error = 'Failed to load job data.';
        this.showSnackBar('❌ Error loading job listings.', 'error');
        this.loading = false;
      }
    });
  }

  checkAppliedStatuses(): void {
    if (!this.currentUserId) return;

    this.jobs.forEach(job => {
      const payload = {
        user_id: this.currentUserId,
        job_id: job.id
      };

      this.http.post<{ applied: boolean }>(
        'http://localhost:3000/applications/check-by-user-and-job',
        payload
      ).subscribe({
        next: (res) => {
          this.appliedStatus[job.id] = res.applied;
        },
        error: () => {
          this.appliedStatus[job.id] = false;
        }
      });
    });
  }

  applyToJob(jobId: string): void {
    if (!this.currentUserId) {
      this.showSnackBar('Please log in to apply for jobs', 'error');
      this.redirectToLogin();
      return;
    }

    const payload = {
      user_id: this.currentUserId,
      job_id: jobId
    };

    this.http.post('http://localhost:3000/applications/by-user', payload).subscribe({
      next: () => {
        this.appliedStatus[jobId] = true;
        this.snackBar.open('✅ Application submitted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',  // 👈 top-right
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        if (error.status === 409) {
          this.appliedStatus[jobId] = true;
          this.showSnackBar('⚠️ You have already applied for this job.', 'warning');
        } else if (error.status === 404) {
          this.showSnackBar('❌ Candidate profile not found for current user.', 'error');
        } else {
          this.showSnackBar('❌ Failed to submit application.', 'error');
        }
      }
    });
  }

  showSnackBar(message: string, type: 'success' | 'warning' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }

  formatPostedDate(dateStr: string): string {
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

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    if (!value) return;
    if (value === 'title') {
      this.jobs.sort((a, b) => a.job_title.localeCompare(b.job_title));
    } else if (value === 'date') {
      this.jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  onWorkModeChange(): void {
    this.filterJobs();
  }

  onEmploymentTypeChange(): void {
    this.filterJobs();
  }

  onNoticePeriodChange(): void {
    this.filterJobs();
  }

  onSearchTermChange(): void {
    this.filterJobs();
  }

  onFiltersChanged(filters: { skillIds: string[]; certIds: string[] }): void {
    this.selectedSkillIds = filters.skillIds;
    this.selectedCertIds = filters.certIds;
    this.filterJobs();
  }

  onFilteredJobIds(filteredJobIds: string[]): void {
    this.filteredJobIdsFromSkills = filteredJobIds;
    this.filterJobs();
  }

  filterJobs(): void {
    this.jobs = this.allJobs.filter((job) => {
      const matchesWorkMode = this.selectedWorkMode
        ? job.work_mode?.toLowerCase() === this.selectedWorkMode.toLowerCase()
        : true;

      const matchesEmploymentType = this.selectedEmploymentTypes.length > 0
        ? this.selectedEmploymentTypes.includes(job.employment_type)
        : true;

      const matchesNoticePeriod = this.selectedNoticePeriod
        ? job.notice_period === this.selectedNoticePeriod
        : true;

      const matchesSearch = this.searchTerm
        ? this.matchesSearchTerm(job, this.searchTerm)
        : true;

      const matchesKeyword = this.searchKeyword
        ? job.job_title?.toLowerCase().includes(this.searchKeyword.toLowerCase())
        : true;

      const matchesLocation = this.searchLocation
        ? job.location?.toLowerCase().includes(this.searchLocation.toLowerCase())
        : true;

      const matchesSkillFilter = this.filteredJobIdsFromSkills.length === 0
        || this.filteredJobIdsFromSkills.includes(job.id);

      return (
        matchesWorkMode &&
        matchesEmploymentType &&
        matchesNoticePeriod &&
        matchesSearch &&
        matchesKeyword &&
        matchesLocation &&
        matchesSkillFilter
      );
    });

    this.jobCount = this.jobs.length;
  }

  matchesSearchTerm(job: any, search: string): boolean {
    const lowerSearch = search.toLowerCase();
    const fieldsToSearch = [
      'job_title',
      'location',
      'employment_type',
      'notice_period',
      'work_mode',
      'job_description',
      'role_summary',
      'preferred_qualifications',
      'what_we_offer',
      'how_to_apply'
    ];

    return fieldsToSearch.some(field => {
      const value = job[field];
      return value && value.toLowerCase().includes(lowerSearch);
    });
  }

  onSearch(): void {
    this.jobs = this.allJobs.filter((job) => {
      const keywordMatch = this.searchKeyword
        ? this.matchesSearchTerm(job, this.searchKeyword)
        : true;

      const locationMatch = this.searchLocation
        ? job.location?.toLowerCase().includes(this.searchLocation.toLowerCase())
        : true;

      return keywordMatch && locationMatch;
    });

    this.jobCount = this.jobs.length;
  }

  toggleSelectAll(event: MouseEvent): void {
    event.stopPropagation();
    const allSelected = this.selectedEmploymentTypes.length === this.employmentTypeOptions.length;
    this.selectedEmploymentTypes = allSelected ? [] : [...this.employmentTypeOptions];
    this.onEmploymentTypeChange();
  }

  onGlobalReset(): void {
    this.selectedEmploymentTypes = [];
    this.selectedWorkMode = '';
    this.selectedNoticePeriod = '';
    this.searchTerm = '';
    this.searchKeyword = '';
    this.searchLocation = '';
    this.selectedSkillIds = [];
    this.selectedCertIds = [];
    this.filteredJobIdsFromSkills = [];

    if (this.skillsFilter) {
      this.skillsFilter.reset();
    }

    this.filterJobs();
  }
}

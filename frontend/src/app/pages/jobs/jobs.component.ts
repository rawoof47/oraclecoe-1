import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

// Components and Pipes
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { SkillFiltersComponent } from './filters/skills-filter/skills-filter.component';
import { CompensationFormatPipe } from '../../shared/pipes/compensation-format.pipe';

// Services
import { AuthStateService } from '../../services/auth-state.service';
import { JobPostService } from '../../services/job-post.service';

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
  currentUserRole: string | null = null;
  error: string | null = null;

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
    private jobPostService: JobPostService,
    private authState: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authState.getCurrentUserId();
    this.currentUserRole = this.authState.getCurrentUserRole();
    
    this.fetchJobs();
  }

  isCandidate(): boolean {
    return this.currentUserRole === 'candidate';
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  // ✅ Updated method using service
  fetchJobs(): void {
  this.jobPostService.getActiveJobs().subscribe({
    next: (response) => {
      this.allJobs = response.data;
      this.jobs = response.data;
      this.jobCount = response.data.length;
      this.loading = false;
      
      // Only check applied status for candidates
      if (this.isCandidate()) {
        this.checkAppliedStatuses();
      }
    },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.error = 'Failed to load job data.';
        alert('❌ Error loading job listings.');
        this.loading = false;
      }
    });
  }

  checkAppliedStatuses(): void {
    if (!this.isCandidate()) return;

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
        error: (err) => {
          console.error(`Error checking status for job ${job.id}:`, err);
          this.appliedStatus[job.id] = false;
        }
      });
    });
  }

  applyToJob(jobId: string): void {
    if (!this.isCandidate()) {
      alert('Please log in to apply for jobs');
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
        alert('✅ Application submitted successfully!');
      },
      error: (error) => {
        if (error.status === 409) {
          this.appliedStatus[jobId] = true;
          alert('⚠️ You have already applied for this job.');
        } else if (error.status === 404) {
          alert('❌ Candidate profile not found for current user.');
        } else {
          alert('❌ Failed to submit application.');
        }
      }
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

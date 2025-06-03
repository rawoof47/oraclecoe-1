import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { JobPostService } from '../../services/job-post.service';
import { JobPost } from '../../auth/models/job-post.model';
import { AuthStateService } from '../../services/auth-state.service';

// ✅ Import the pipe from its shared location
import { CompensationFormatPipe } from '../../shared/pipes/compensation-format.pipe';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf,
    CarouselModule,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    CompensationFormatPipe // ✅ Include in component imports
  ],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  jobPost: JobPost | null = null;
  isLoading = true;
  error: string | null = null;
  isOpen = false;

  jobSkills: any[] = [];
  jobCertifications: any[] = [];

  userId: string | null = null;
  jobId: string = '';
  hasApplied = false;
  applyStatusMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPostService: JobPostService,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    console.log('[JobDetailsComponent] ✅ ngOnInit called');

    this.userId = this.authState.getCurrentUserId();

    this.route.paramMap.subscribe(params => {
      const jobIdParam = params.get('id');
      if (jobIdParam) {
        this.jobId = jobIdParam;
        this.fetchJobPost(this.jobId);
        this.fetchJobSkills(this.jobId);
        this.fetchJobCertifications(this.jobId);

        if (this.userId) {
          this.checkIfUserAlreadyApplied(this.userId, this.jobId);
        }
      } else {
        console.error('[JobDetailsComponent] ❌ Invalid job ID in route param');
        this.error = 'Invalid job ID';
        this.isLoading = false;
      }
    });
  }

  fetchJobPost(jobId: string): void {
    this.jobPostService.getById(jobId).subscribe({
      next: (res: any) => {
        if (res?.data?.data) {
          this.jobPost = res.data.data;
        } else {
          this.error = 'Unexpected response format';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load job details';
        this.isLoading = false;
      }
    });
  }

  fetchJobSkills(jobId: string): void {
    this.jobPostService.getSkillsByJobPostId(jobId).subscribe({
      next: (res: any) => {
        this.jobSkills = res?.data || res || [];
      },
      error: (err) => {
        console.error('[JobDetailsComponent] ❌ Failed to fetch job skills:', err);
      }
    });
  }

  fetchJobCertifications(jobId: string): void {
    this.jobPostService.getCertificationsByJobPostId(jobId).subscribe({
      next: (res: any) => {
        this.jobCertifications = res?.data || res || [];
      },
      error: (err) => {
        console.error('[JobDetailsComponent] ❌ Failed to fetch job certifications:', err);
      }
    });
  }

  checkIfUserAlreadyApplied(userId: string, jobId: string): void {
    this.jobPostService.checkIfUserApplied(userId, jobId).subscribe({
      next: (res: { applied: boolean }) => {
        this.hasApplied = res.applied;
        this.applyStatusMessage = res.applied
          ? 'You have already applied for this job.'
          : 'You can apply for this job.';
      },
      error: (err) => {
        console.error('[JobDetailsComponent] ❌ Failed to check application status:', err);
        this.applyStatusMessage = 'Unable to verify application status.';
      }
    });
  }

  applyToJob(): void {
    if (this.hasApplied) return;

    if (!this.userId) {
      alert('Please log in to apply for this job');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.jobPostService.applyToJob(this.userId, this.jobId).subscribe({
      next: () => {
        this.hasApplied = true;
        this.applyStatusMessage = 'You have successfully applied for this job.';
        alert('✅ Application submitted successfully!');
      },
      error: (error) => {
        if (error.status === 409) {
          this.hasApplied = true;
          this.applyStatusMessage = 'You have already applied for this job.';
          alert('⚠️ You have already applied for this job.');
        } else {
          console.error('[JobDetailsComponent] ❌ Failed to apply:', error);
          alert('❌ Failed to submit application. Please try again.');
        }
      }
    });
  }

  openPopup(): void {
    this.isOpen = true;
  }

  closePopup(): void {
    this.isOpen = false;
  }

  videoSlides: OwlOptions = {
    margin: 0,
    nav: true,
    loop: true,
    dots: false,
    items: 1,
    smartSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    navText: [
      "<i class='flaticon-left-arrow'></i>",
      "<i class='flaticon-right-arrow'></i>"
    ]
  };
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { JobPostService } from '../../services/job-post.service';
import { JobPost } from '../../auth/models/job-post.model';
import { AuthStateService } from '../../services/auth-state.service';
import { CompensationFormatPipe } from '../../shared/pipes/compensation-format.pipe';
import { ApplicationStatusService } from '../../services/application-status.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    CompensationFormatPipe
  ],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
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
  userRole$!: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPostService: JobPostService,
    private authState: AuthStateService,
    private applicationStatusService: ApplicationStatusService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.authState.getCurrentUserId();
    this.userRole$ = this.authState.userRole$;

    this.route.paramMap.subscribe(params => {
      const jobIdParam = params.get('jobId'); // e.g. jid42

      if (jobIdParam) {
        if (jobIdParam.toUpperCase().startsWith('JID')) {
          const jobNumber = +jobIdParam.substring(3); // Remove 'JID' prefix

          if (!isNaN(jobNumber)) {
            this.fetchJobPostByJobNumber(jobNumber);
            return;
          }
        }
        this.error = 'Invalid job number format';
      } else {
        this.error = 'Job ID is missing';
      }

      this.isLoading = false;
    });
  }

  fetchJobPostByJobNumber(jobNumber: number): void {
  this.jobPostService.getByJobNumber(jobNumber).subscribe({
    next: (res: any) => {
      this.jobPost = res.data || null;
      if (this.jobPost) {
        this.jobId = this.jobPost.id!;

        this.fetchJobSkills(this.jobId);
        this.fetchJobCertifications(this.jobId);

        if (this.userId) {
          this.checkIfUserAlreadyApplied(this.userId, this.jobId);
        }

        this.applicationStatusService.statusUpdated$
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ jobId, applied }) => {
            if (jobId === this.jobId) {
              this.hasApplied = applied;
              this.applyStatusMessage = applied
                ? 'You have already applied for this job.'
                : 'You can apply for this job.';
            }
          });
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.error = err.error?.message || 'Failed to load job details';
      this.snackBar.open('❌ Failed to load job details', 'Dismiss', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
    }
  });
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.snackBar.open('Please log in to apply for this job', 'Login', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      });
      return;
    }

    this.jobPostService.applyToJob(this.userId, this.jobId).subscribe({
      next: () => {
        this.hasApplied = true;
        this.applyStatusMessage = 'You have successfully applied for this job.';
        this.applicationStatusService.updateStatus(this.jobId, true);

        if (this.userId) {
          this.checkIfUserAlreadyApplied(this.userId, this.jobId);
        }

        this.snackBar.open('✅ Application submitted successfully!', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        if (error.status === 409) {
          this.hasApplied = true;
          this.applyStatusMessage = 'You have already applied for this job.';
          this.snackBar.open('⚠️ You already applied for this job', 'Dismiss', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['warning-snackbar']
          });
        } else {
          console.error('[JobDetailsComponent] ❌ Failed to apply:', error);
          this.snackBar.open('❌ Failed to submit application', 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
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

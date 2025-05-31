import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { JobPostService } from '../../services/job-post.service';
import { JobPost } from '../../auth/models/job-post.model';

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
    BackToTopComponent
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

  constructor(
    private route: ActivatedRoute,
    private jobPostService: JobPostService
  ) {}

  ngOnInit(): void {
    console.log('[JobDetailsComponent] ✅ ngOnInit called');
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      console.log('[JobDetailsComponent] ✅ Extracted jobId from route:', jobId);

      if (jobId) {
        this.fetchJobPost(jobId);
        this.fetchJobSkills(jobId);
        this.fetchJobCertifications(jobId);
      } else {
        console.error('[JobDetailsComponent] ❌ Invalid job ID in route param');
        this.error = 'Invalid job ID';
        this.isLoading = false;
      }
    });
  }

  fetchJobPost(jobId: string): void {
    console.log(`[JobDetailsComponent] 🔄 Initiating job post API call for jobId: ${jobId}`);
    this.jobPostService.getById(jobId).subscribe({
      next: (res: any) => {
        console.log('[JobDetailsComponent] 📦 Raw API response for job post:', res);
        if (res && res.data && res.data.data) {
          this.jobPost = res.data.data;
          console.log('[JobDetailsComponent] ✅ Parsed jobPost object:', this.jobPost);
        } else {
          console.warn('[JobDetailsComponent] ⚠️ Unexpected API response format for job post:', res);
          this.error = 'Unexpected response format';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[JobDetailsComponent] ❌ API call failed for job post:', err);
        this.error = err.error?.message || 'Failed to load job details';
        this.isLoading = false;
      }
    });
  }

  fetchJobSkills(jobId: string): void {
    console.log(`[JobDetailsComponent] 🔄 Fetching skills for jobId: ${jobId}`);
    this.jobPostService.getSkillsByJobPostId(jobId).subscribe({
      next: (res: any) => {
        this.jobSkills = res?.data || res || [];
        console.log('[JobDetailsComponent] ✅ Loaded job skills:', this.jobSkills);
      },
      error: (err) => {
        console.error('[JobDetailsComponent] ❌ Failed to fetch job skills:', err);
      }
    });
  }

  fetchJobCertifications(jobId: string): void {
    console.log(`[JobDetailsComponent] 🔄 Fetching certifications for jobId: ${jobId}`);
    this.jobPostService.getCertificationsByJobPostId(jobId).subscribe({
      next: (res: any) => {
        this.jobCertifications = res?.data || res || [];
        console.log('[JobDetailsComponent] ✅ Loaded job certifications:', this.jobCertifications);
      },
      error: (err) => {
        console.error('[JobDetailsComponent] ❌ Failed to fetch job certifications:', err);
      }
    });
  }

  openPopup(): void {
    console.log('[JobDetailsComponent] ✅ Popup opened');
    this.isOpen = true;
  }

  closePopup(): void {
    console.log('[JobDetailsComponent] ✅ Popup closed');
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobPostService } from '../../services/job-post.service';
import { JobPost } from '../../auth/models/job-post.model';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-a-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
  ],
  templateUrl: './post-a-job.component.html',
  styleUrl: './post-a-job.component.scss'
})
export class PostAJobComponent {
  jobForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private toastr: ToastrService
  ) {
    this.jobForm = this.fb.group({
      job_title: ['', Validators.required],
      location: [''],
      modules_required: [''],
      skills_required: [''],
      certifications_required: [''],
      experience_min: [null],
      experience_max: [null],
      employment_type: [''],
      compensation_range: [''],
      job_description: [''],
      notice_period: [''],
      application_deadline: [''],
      status_id: ['', Validators.required],
      recruiter_id: ['', Validators.required], // Ideally from token
      created_by: [''], // Fill from logged-in user if available
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.toastr.error('Please fill in the required fields.');
      return;
    }

    this.loading = true;

    const jobData: JobPost = this.jobForm.value;

    this.jobPostService.create(jobData).subscribe({
      next: () => {
        this.toastr.success('Job posted successfully!');
        this.jobForm.reset();
      },
      error: (err) => {
        this.toastr.error('Failed to post job. Please try again.');
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  loading = true;
  error: string | null = null;
  currentUserId = 1; // ✅ Replace with actual logged-in user ID

  constructor(private http: HttpClient) {
    console.log('JobsComponent: constructor called');
  }

  ngOnInit(): void {
    console.log('JobsComponent: ngOnInit called');
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.http.get<any[]>('http://localhost:3000/jobs').subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.error = 'Failed to load job data.';
        this.loading = false;
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
      this.jobs.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  }

  applyToJob(jobId: string): void {
    const payload = {
      candidate_id: this.currentUserId, // ✅ Replace with actual UUID from auth
      job_id: jobId,
      application_status_id: null, // Or use default status ID if needed
      withdrawn: 0,
      created_by: this.currentUserId,
      updated_by: this.currentUserId
    };

    this.http.post('http://localhost:3000/applications', payload).subscribe({
      next: () => {
        console.log('Application submitted successfully!');
      },
      error: (error) => {
        if (error.status === 409) {
          console.warn('You have already applied for this job.');
        } else {
          console.error('Failed to submit application.', error);
        }
      }
    });
  }
}

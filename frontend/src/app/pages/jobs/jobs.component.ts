import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule, // ✅ Required for *ngIf, *ngFor, etc.
    RouterLink,
    NavbarComponent,
    PageBannerComponent,
    FooterComponent,
    BackToTopComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {
    console.log('JobsComponent: constructor called');
  }

  ngOnInit(): void {
    console.log('JobsComponent: ngOnInit called');
    this.fetchJobs();
  }

  fetchJobs(): void {
    console.log('JobsComponent: fetchJobs called - sending HTTP GET to /api/jobs');
    this.http.get<any[]>('http://localhost:3000/jobs')
      .subscribe({
        next: (data) => {
          console.log('JobsComponent: Data received from backend:', data);
          this.jobs = data;
          this.loading = false;
          console.log('JobsComponent: jobs array updated, loading set to false');
        },
        error: (err) => {
          console.error('JobsComponent: Error fetching jobs:', err);
          this.error = 'Failed to load job data.';
          this.loading = false;
          console.log('JobsComponent: loading set to false after error');
        }
      });
  }

  formatPostedDate(dateStr: string): string {
    console.log(`JobsComponent: formatPostedDate called with value: ${dateStr}`);
    if (!dateStr) return 'Unknown date';

    const postedDate = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((+now - +postedDate) / (1000 * 60 * 60 * 24));

    let formattedDate = '';
    if (diff === 0) formattedDate = 'Today';
    else if (diff === 1) formattedDate = '1 day ago';
    else if (diff < 30) formattedDate = `${diff} days ago`;
    else {
      const months = Math.floor(diff / 30);
      formattedDate = months === 1 ? '1 month ago' : `${months} months ago`;
    }

    console.log(`JobsComponent: formatted date = ${formattedDate}`);
    return formattedDate;
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value;
    console.log(`JobsComponent: onSortChange called with value: ${value}`);

    if (!value) {
      console.warn('JobsComponent: Sort value is undefined or null');
      return;
    }

    if (value === 'title') {
      this.jobs.sort((a, b) => a.job_title.localeCompare(b.job_title));
      console.log('JobsComponent: jobs sorted by title');
    } else if (value === 'date') {
      this.jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      console.log('JobsComponent: jobs sorted by date');
    }
  }
}

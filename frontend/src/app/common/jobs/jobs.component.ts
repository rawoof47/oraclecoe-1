import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {

  // Tabs
  currentTab = 'tab1';

  constructor(private http: HttpClient) {}

  switchTab(event: MouseEvent, tab: string): void {
    event.preventDefault();
    this.currentTab = tab;
  }

  applyToJob(jobId: number): void {
    this.http.post('/api/job-applications', { jobId }).subscribe({
      next: () => {
        alert('Application submitted successfully!');
      },
      error: (err) => {
        if (err.status === 409) {
          alert('You have already applied for this job.');
        } else {
          alert('Failed to submit application.');
        }
      }
    });
  }
}

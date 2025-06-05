import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-job-applicants',
  imports: [CommonModule],
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss']
})
export class JobApplicantsComponent {
  applicants = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      appliedDate: '2025-06-04',
      resumeUrl: '#',
      status: 'Pending'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      appliedDate: '2025-06-02',
      resumeUrl: '#',
      status: 'Shortlisted'
    }
  ];
}

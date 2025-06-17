import { Component, OnInit } from '@angular/core';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RecruiterSidebarComponent } from '../../common/recruiter-sidebar/recruiter-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    RecruiterSidebarComponent
  ],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent implements OnInit {
  profileData: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(private profileService: RecruiterProfileService) {}

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch profile data:', err);
        this.error = 'Failed to load profile data. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
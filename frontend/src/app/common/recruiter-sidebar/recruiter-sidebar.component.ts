import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { RecruiterProfileService } from '../../services/recruiter-profile.service'; // Add this import

@Component({
  selector: 'app-recruiter-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './recruiter-sidebar.component.html',
  styleUrls: ['./recruiter-sidebar.component.scss']
})
export class RecruiterSidebarComponent implements OnInit {
  firstName: string = '';
  position: string = ''; // New property for position
  profileImage: string = 'img/ChatGPT Image Jun 8, 2025, 02_58_52 PM.png';

  constructor(
    private authState: AuthStateService,
    private recruiterProfileService: RecruiterProfileService // Inject service
  ) {}

  ngOnInit() {
    const user = this.authState.getCurrentUser();
    if (user) {
      this.firstName = user.first_name || 'Recruiter';
      
      // Fetch recruiter profile
      this.recruiterProfileService.getMyProfile().subscribe({
        next: (profile) => {
          if (profile && profile.recruiter_position) {
            this.position = profile.recruiter_position;
          } else {
            this.position = 'Recruiter'; // Default fallback
          }
        },
        error: () => {
          this.position = 'Recruiter'; // Fallback on error
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './recruiter-sidebar.component.html',
  styleUrls: ['./recruiter-sidebar.component.scss']
})
export class RecruiterSidebarComponent implements OnInit {
  firstName: string = '';
  position: string = '';
  profileImage: string = 'img/dashboard4.png';
  loadingImage: boolean = false;

  constructor(
    private authState: AuthStateService,
    private recruiterProfileService: RecruiterProfileService
  ) {}

  ngOnInit() {
    const user = this.authState.getCurrentUser();
    if (user) {
      this.firstName = user.first_name || 'Recruiter';

      this.recruiterProfileService.getMyProfile().subscribe({
        next: (profile) => {
          if (profile) {
            this.position = profile.recruiter_position || 'Recruiter';

            // ✅ Use cache-busted logo URL
            if (profile.company_logo_url) {
              this.profileImage = this.addCacheBuster(profile.company_logo_url);
            }
          } else {
            this.position = 'Recruiter';
          }
        },
        error: () => {
          this.position = 'Recruiter';
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      console.error('Only image files are allowed');
      return;
    }

    event.target.value = ''; // Reset input
    this.loadingImage = true;

    this.recruiterProfileService.uploadCompanyLogo(file).subscribe({
      next: (response) => {
        this.profileImage = this.addCacheBuster(response.url); // ✅ Apply cache buster
        this.loadingImage = false;
      },
      error: (error) => {
        console.error('Image upload failed:', error);
        this.loadingImage = false;
      }
    });
  }

  // ✅ Cache buster to prevent stale image
  private addCacheBuster(url: string): string {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
  }

  // ✅ Fallback image on error
  handleImageError(element: HTMLImageElement) {
    element.src = 'img/dashboard4.png';
  }
}

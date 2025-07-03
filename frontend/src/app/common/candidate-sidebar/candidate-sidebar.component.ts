import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service'; // Adjust path
import { CandidateProfileService } from '../../services/candidate-profile.service'; // Import ProfileService

@Component({
  selector: 'app-candidate-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-sidebar.component.html',
  styleUrls: ['./candidate-sidebar.component.scss']
})
export class CandidateSidebarComponent implements OnInit {
  firstName: string = '';
  profileImage: string = 'img/dashboard3.png'; // Use existing image path
  selectedFile: File | null = null; // Add selectedFile property

  constructor(
    private authState: AuthStateService,
    private CandidateProfileService: CandidateProfileService // Inject ProfileService
  ) {}

  ngOnInit() {
    const user = this.authState.getCurrentUser();
    if (user) {
      this.firstName = user.first_name || 'User';
    }
  }

  // Add file selection handler
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    if (!file) return;

    // Optional: size/type validation
    if (file.size > 1024 * 1024) { // 1MB limit
      alert('Image must be less than 1MB');
      return;
    }

    this.selectedFile = file;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.CandidateProfileService.uploadProfileImage(formData).subscribe({
      next: (res) => {
        this.profileImage = res.url; // update displayed image
        // Optionally save to DB with a userService call
      },
      error: (err) => {
        console.error('Upload failed:', err);
        alert('Image upload failed. Please try again.');
      }
    });
  }
}
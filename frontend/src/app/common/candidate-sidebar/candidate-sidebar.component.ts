import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidate-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './candidate-sidebar.component.html',
  styleUrls: ['./candidate-sidebar.component.scss']
})
export class CandidateSidebarComponent implements OnInit {
  firstName: string = '';
  profileImage: string = 'assets/images/default-avatar.png'; // fallback image
  selectedFile: File | null = null;

  constructor(
    private authState: AuthStateService,
    private CandidateProfileService: CandidateProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const user = this.authState.getCurrentUser();
    if (user) {
      this.firstName = user.first_name || 'User';

      // ✅ Load saved profile image from backend
      this.CandidateProfileService.getMyProfile().subscribe({
        next: (profile) => {
          this.profileImage = profile.profile_pic_url || 'assets/images/default-avatar.png';
        },
        error: () => {
          this.profileImage = 'assets/images/default-avatar.png';
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      this.snackBar.open('Image must be less than 1MB', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.selectedFile = file;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.CandidateProfileService.uploadProfileImage(formData).subscribe({
      next: (res) => {
        this.profileImage = res.url;
        this.snackBar.open('Profile image uploaded successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      error: () => {
        this.snackBar.open('Image upload failed. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
}

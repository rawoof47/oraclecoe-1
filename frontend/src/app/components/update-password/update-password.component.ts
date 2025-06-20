import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from '../../services/settings.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private authStateService: AuthStateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authStateService.getCurrentUser();
    this.userId = user?.id || null;

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.snackBar.open(' New passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    if (this.userId) {
      // 🔒 Optionally send currentPassword to backend for verification
      this.settingsService.updatePassword(this.userId, newPassword).subscribe({
        next: () => this.snackBar.open(' Password updated successfully', 'Close', { duration: 3000 }),
        error: () => this.snackBar.open(' Failed to update password', 'Close', { duration: 3000 })
      });
    }
  }
}

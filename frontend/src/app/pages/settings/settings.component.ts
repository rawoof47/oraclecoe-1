import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { SettingsService } from '../../services/settings.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  userId: string | null = null;
  currentEmail: string = '';
  userRoleLabel: string = 'Employee'; // Default role

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authStateService.getCurrentUser();
    this.userId = currentUser?.id || null;
    this.currentEmail = currentUser?.email || '';
    this.userRoleLabel = currentUser?.role === 'recruiter' ? 'Employer' : 'Employee';

    this.emailForm = this.fb.group({
      email: [this.currentEmail, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
       newPassword: [
  '',
  [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
  ]
],

        confirmPassword: ['', Validators.required],
      },
      {
        validators: (form: FormGroup) => {
          const newPassword = form.get('newPassword')?.value;
          const confirmPassword = form.get('confirmPassword')?.value;
          return newPassword === confirmPassword ? null : { mismatch: true };
        },
      }
    );
  }

  updateEmail(): void {
    if (this.emailForm.valid && this.userId) {
      this.settingsService.updateEmail(this.userId, this.emailForm.value.email).subscribe({
        next: () => this.showToast(`${this.userRoleLabel} email updated successfully.`),
        error: () => this.showToast(`Failed to update ${this.userRoleLabel.toLowerCase()} email.`, false),
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid && this.userId) {
      this.settingsService.updatePassword(this.userId, this.passwordForm.value.newPassword).subscribe({
        next: () => this.showToast(`${this.userRoleLabel} password changed successfully.`),
        error: () => this.showToast(`Failed to update ${this.userRoleLabel.toLowerCase()} password.`, false),
      });
    }
  }

  private showToast(message: string, isSuccess: boolean = true): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: isSuccess ? ['snack-success'] : ['snack-error'],
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}

}

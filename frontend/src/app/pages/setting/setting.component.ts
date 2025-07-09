// setting.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';
import { NavbarComponent } from '../../common/navbar/navbar.component'; // Add this
import { FooterComponent } from '../../common/footer/footer.component'; // Add this

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatIconModule,
     NavbarComponent, // Add this
    FooterComponent 
  ],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  passwordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isSubmitting = false;

  // Snackbar config
  private snackConfig: any = {
    duration: 4000,
    verticalPosition: 'top',
    horizontalPosition: 'right'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authState: AuthStateService,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password matching
  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return newPassword && confirmPassword && newPassword === confirmPassword 
      ? null 
      : { mismatch: true };
  };

  // Fixed getter to avoid index signature error
  getControl(name: string) {
    return this.passwordForm.get(name);
  }

  onSubmit(): void {
  if (this.passwordForm.invalid) return;
  
  this.isSubmitting = true;
  const formData = this.passwordForm.value;

  this.authService.changePassword(
    formData.currentPassword,
    formData.newPassword
  ).subscribe({
    next: () => {
      this.snackBar.open('Password updated successfully!', 'Close', {
        ...this.snackConfig,
        panelClass: ['snack-success']
      });
      this.passwordForm.reset();
      this.isSubmitting = false;
    },
    error: (err) => {
      this.isSubmitting = false;
      
      // Extract error message from backend response
      let message = 'Password change failed';
      if (err.error?.message) {
        message = err.error.message;
      } else if (err.message) {
        message = err.message;
      }

      // Handle specific "incorrect password" case
      if (message.toLowerCase().includes('current password') || 
          message.toLowerCase().includes('incorrect')) {
        message = 'Current password is incorrect. Please try again.';
      }

      this.snackBar.open(message, 'Close', {
        ...this.snackConfig,
        panelClass: ['snack-error']
      });
    }
  });
}}
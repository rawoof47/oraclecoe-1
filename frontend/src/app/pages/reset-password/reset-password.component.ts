import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {  MatSnackBarConfig } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service'; // ✅ Adjust if needed

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isSubmitting = false;
  hideNewPassword = true;
  hideConfirmPassword = true;

  // SnackBar Configs
  private snackConfig: MatSnackBarConfig = {
    duration: 3000,
    verticalPosition: 'top',
    horizontalPosition: 'right'
  };

  private successConfig: MatSnackBarConfig = {
    ...this.snackConfig,
    panelClass: ['snack-success']
  };

  private errorConfig: MatSnackBarConfig = {
    ...this.snackConfig,
    panelClass: ['snack-error', 'custom-snackbar']
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.resetForm = this.fb.group({
      newPassword: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8),
          Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordsMatchValidator(form: FormGroup) {
    const pw = form.get('newPassword')?.value;
    const cpw = form.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;

    const newPassword = this.resetForm.get('newPassword')?.value;
    this.isSubmitting = true;

    // Show processing snackbar
    const processingSnack = this.snackBar.open('Resetting your password...', '', {
      ...this.snackConfig,
      duration: undefined
    });

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        processingSnack.dismiss();
        this.snackBar.open('Password has been reset successfully!', 'Close', this.successConfig);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        processingSnack.dismiss();
        const msg = err.error?.message || 'Failed to reset password.';
        
        if (msg.toLowerCase().includes('token')) {
          this.snackBar.open('Please request a new password reset.', 'Close', {
            ...this.errorConfig,
            duration: 5000
          });
        } else {
          this.snackBar.open(msg, 'Close', this.errorConfig);
        }
        
        this.isSubmitting = false;
      }
    });
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule
  ]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        mobile_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        role: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };

  onSubmit(): void {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snackbar-error']
      });
      return;
    }

    const { email, mobile_number, role, newPassword } = this.forgotPasswordForm.value;
    const mappedRole = role === 'Candidate' ? 'candidate' : 'recruiter';

    
    this.authService.resetPassword(email, mobile_number, mappedRole, newPassword).subscribe({
      next: () => {
        this.snackBar.open('✅ Password reset successful!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snackbar-success']
        });
        this.forgotPasswordForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || '❌ Password reset failed.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}

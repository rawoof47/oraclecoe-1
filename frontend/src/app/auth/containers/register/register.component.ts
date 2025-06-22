import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth-state.service';
import { RegisterRequest } from '../../models/register-request.model';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, RouterModule, MatTooltipModule, MatIconModule  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  hidePassword = true;
  hideConfirmPassword = true;

  private readonly roleMap: Record<string, string> = {
    Candidate: 'c1bb8df5-2c01-11f0-b60f-80ce6232908a',
    Recruiter: 'c1bb84ef-2c01-11f0-b60f-80ce6232908a'
  };

  private readonly defaultStatusId = '17d2f849-3a1a-11f0-8520-ac1f6bbcd360';

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
    private authService: AuthService,
    private authStateService: AuthStateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['Candidate', [Validators.required]],
      password: [
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

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.errors?.['mismatch']) {
      this.snackBar.open('Passwords do not match. Please re-enter.', 'Close', {
        ...this.errorConfig,
        duration: 4000
      });
      return;
    }

    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.errors?.['pattern']) {
      this.snackBar.open(
        'Password must include uppercase, lowercase, number & symbol.',
        'Close',
        {
          ...this.errorConfig,
          duration: 4000
        }
      );
      return;
    }

    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', this.errorConfig);
      return;
    }

    const registrationSnack = this.snackBar.open('Processing your registration...', '', {
      ...this.snackConfig,
      duration: undefined
    });

    const request: RegisterRequest = {
      email: this.f['email'].value,
      mobile_number: this.f['mobile_number'].value,
      role_id: this.roleMap[this.f['role'].value],
      password_hash: this.f['password'].value,
      status_id: this.defaultStatusId
    };

    this.authService.register(request).subscribe({
      next: () => {
        registrationSnack.dismiss();

        const successSnack = this.snackBar.open('Registration successful! Logging you in...', '', {
          ...this.successConfig,
          duration: undefined
        });

        const role = this.f['role'].value;
        const email = this.f['email'].value;
        const password = this.f['password'].value;

        const loginReq: LoginRequest = { email, password };

        this.authService.login(loginReq).subscribe({
          next: (loginRes) => {
            successSnack.dismiss();
            this.authStateService.setAuthState(loginRes.token, {
              id: loginRes.uuid,
              role: loginRes.role,
              email: email
            });

            const redirectPath = role === 'Candidate'
              ? '/candidate-profile'
              : '/recruiter-profile';

            this.snackBar.open('Login successful! Redirecting to your profile...', 'Close', {
              ...this.successConfig,
              duration: 3000
            });

            this.router.navigate([redirectPath]);
          },
          error: () => {
            successSnack.dismiss();
            this.snackBar.open('Registration successful! Please log in manually.', 'Close', this.successConfig);
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        registrationSnack.dismiss();
        const msg = err?.error?.message?.toLowerCase() || '';

        if (msg.includes('email') && msg.includes('exists')) {
          this.snackBar.open('Email already exists. Please use a different one.', 'Close', this.errorConfig);
        } else {
          this.snackBar.open(err?.error?.message || 'Registration failed. Please try again.', 'Close', this.errorConfig);
        }
      }
    });
  }
}

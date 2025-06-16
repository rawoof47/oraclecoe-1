import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth-state.service'; // ✅ New import
import { RegisterRequest } from '../../models/register-request.model';
import { LoginRequest } from '../../models/login-request.model'; // ✅ New import

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;

  private readonly roleMap: Record<string, string> = {
    Candidate: 'c1bb8df5-2c01-11f0-b60f-80ce6232908a',
    Recruiter: 'c1bb84ef-2c01-11f0-b60f-80ce6232908a'
  };
  private readonly defaultStatusId = '17d2f849-3a1a-11f0-8520-ac1f6bbcd360';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authStateService: AuthStateService, // ✅ Injected service
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['Candidate', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
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

    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['snack-error', 'custom-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    const request: RegisterRequest = {
      email: this.f['email'].value,
      mobile_number: this.f['mobile_number'].value,
      role_id: this.roleMap[this.f['role'].value],
      password_hash: this.f['password'].value,
      status_id: this.defaultStatusId
    };

    this.authService.register(request).subscribe({
      next: () => {
        const role = this.f['role'].value;
        const email = this.f['email'].value;
        const password = this.f['password'].value;

        if (role === 'Candidate') {
          const loginReq: LoginRequest = { email, password };

          this.authService.login(loginReq).subscribe({
            next: (loginRes) => {
              this.authStateService.setAuthState(
                loginRes.token,
                {
                  id: loginRes.uuid,
                  role: loginRes.role,
                  email: email
                }
              );

              this.snackBar.open('Registration successful! Redirecting to your profile...', 'Close', {
                duration: 3000,
                panelClass: ['snack-success'],
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });

              this.router.navigate(['/candidate-profile']);
            },
            error: () => {
              this.snackBar.open('Registration successful! Please log in.', 'Close', {
                duration: 3000,
                panelClass: ['snack-success'],
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.snackBar.open('Registration successful! Please log in.', 'Close', {
            duration: 3000,
            panelClass: ['snack-success'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        const msg = err?.error?.message?.toLowerCase() || '';

        if (msg.includes('email') && msg.includes('exists')) {
          this.snackBar.open('Email already exists. Please use a different one.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error', 'custom-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } else {
          this.snackBar.open(err?.error?.message || 'Registration failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error', 'custom-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      }
    });
  }
}

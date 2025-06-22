import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CandidateProfileService } from '../../../services/candidate-profile.service'; // ✅ New import

import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
showPassword = false; // Added for password visibility toggle
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private router: Router,
    private snackBar: MatSnackBar,
    private candidateProfileService: CandidateProfileService // ✅ New dependency
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

   togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
   }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showSnackBar('Please fill in all required fields.', 'snack-error');
      console.error('❌ Form validation failed:', this.loginForm.value);
      return;
    }

    const { email, password, role } = this.loginForm.value;
    this.isSubmitting = true;
    console.log('🔐 Attempting login with:', { email, role });

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        console.log('✅ Login response:', res);
        const token = res.token;
        const user = {
          id: res.uuid,
          role: res.role,
          email: (res as { email?: string }).email
        };

        if (!token || !user.id || !user.role) {
          this.showSnackBar('Invalid response from server.', 'snack-error');
          console.error('❌ Missing token or user info in response:', res);
          return;
        }

        // ✅ Fetch full user details and set complete auth state
        this.candidateProfileService.getUser(user.id).subscribe({
          next: (userDetails) => {
            const fullUser = {
              id: user.id,
              role: user.role,
              email: userDetails.email,
              first_name: userDetails.first_name,
              last_name: userDetails.last_name
            };
            this.authStateService.setAuthState(token, fullUser);

            if (user.role === role) {
              this.showSnackBar('Login successful!', 'snack-success');
              if (user.role === 'candidate') {
                this.router.navigate(['/jobs']);
              } else if (user.role === 'recruiter') {
                this.router.navigate(['/recruiter-dashboard']);
              } else {
                this.showSnackBar('Unsupported role.', 'snack-error');
                console.warn('⚠️ Role not handled:', user.role);
              }
            } else {
              this.showSnackBar(`You are not registered as a ${role}.`, 'snack-error');
              console.warn('⚠️ Role mismatch:', { selectedRole: role, returnedRole: user.role });
            }
          },
          error: (fetchError) => {
            this.showSnackBar('Failed to fetch user details.', 'snack-error');
            console.error('❌ Error fetching user details:', fetchError);
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        const message = err.error?.message || 'Login failed. Please try again.';
        this.showSnackBar(message, 'snack-error');
        console.error('❌ Login error:', err);
      }
    });
  }

  private showSnackBar(message: string, panelClass: string = '') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }
}

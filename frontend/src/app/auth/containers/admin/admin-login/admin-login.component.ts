import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../../services/auth.service';
import { AuthStateService } from '../../../../services/auth-state.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule]
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showSnackBar('Please fill in all required fields.', 'snack-error');
      console.error('❌ Form validation failed:', this.loginForm.value);
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isSubmitting = true;
    console.log('🔐 Attempting login as admin with:', { email });

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        console.log('✅ Login response:', res);

        const response = res as typeof res & { email?: string };

        const token = response.token;
        const user = {
          id: response.uuid,
          role: response.role,
          email: response.email || '',
          first_name: 'Admin',   // ✅ Added default first name
          last_name: 'User'      // ✅ Added default last name
        };

        if (!token || !user.id || !user.role) {
          this.showSnackBar('Invalid response from server.', 'snack-error');
          console.error('❌ Missing token or user info in response:', res);
          return;
        }

        if (user.role.toLowerCase() !== 'admin') {
          this.showSnackBar('Access denied. Admins only.', 'snack-error');
          console.warn('⚠️ Non-admin login attempt:', user.role);
          return;
        }

        this.authStateService.setAuthState(token, user);
        this.showSnackBar('Login successful!', 'snack-success');

      
        this.router.navigate(['/index-2']);
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

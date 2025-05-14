import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
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
        const uuid = res.uuid;
        const userRole = res.role;

        if (!token || !uuid || !userRole) {
          this.showSnackBar('Invalid response from server.', 'snack-error');
          console.error('❌ Missing token/uuid/role in response:', res);
          return;
        }

        localStorage.setItem('accessToken', token);
        localStorage.setItem('userUUID', uuid);
        localStorage.setItem('userRole', userRole);

        if (userRole === role) {
          this.showSnackBar('Login successful!', 'snack-success');
          if (userRole === 'candidate') {
            this.router.navigate(['/jobs']);
          } else if (userRole === 'recruiter') {
            this.router.navigate(['/post-a-job']);
          } else {
            this.showSnackBar('Unsupported role.', 'snack-error');
            console.warn('⚠️ Role not handled:', userRole);
          }
        } else {
          this.showSnackBar(`You are not registered as a ${role}.`, 'snack-error');
          console.warn('⚠️ Role mismatch:', { selectedRole: role, returnedRole: userRole });
        }
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

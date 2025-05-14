import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required] // candidate or recruiter
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      alert(this.errorMessage);
      console.error('❌ Form validation failed:', this.loginForm.value);
      return;
    }

    const { email, password, role } = this.loginForm.value;
    console.log('🔐 Attempting login with:', { email, role });

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        console.log('✅ Login response:', res);
        const token = res.token;
        const uuid = res.uuid;
        const userRole = res.role;

        if (!token || !uuid || !userRole) {
          this.errorMessage = 'Invalid response from server.';
          alert(this.errorMessage);
          console.error('❌ Missing token/uuid/role in response:', res);
          return;
        }

        // Store data
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userUUID', uuid);
        localStorage.setItem('userRole', userRole);

        // Role check
        if (userRole === role) {
          if (userRole === 'candidate') {
            this.router.navigate(['/jobs']);
          } else if (userRole === 'recruiter') {
            this.router.navigate(['/post-a-job']);
          } else {
            this.errorMessage = 'Unsupported role.';
            alert(this.errorMessage);
            console.warn('⚠️ Role not handled:', userRole);
          }
        } else {
          this.errorMessage = `You are not registered as a ${role}.`;
          alert(this.errorMessage);
          console.warn('⚠️ Role mismatch:', { selectedRole: role, returnedRole: userRole });
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        alert(this.errorMessage);
        console.error('❌ Login error:', err);
      }
    });
  }
}

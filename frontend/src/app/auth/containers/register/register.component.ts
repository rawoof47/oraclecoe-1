import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
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
  private readonly defaultStatusId = 'b2fe49c1-2aeb-4a96-b661-e685366c4917';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
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
        panelClass: 'snack-error'
      });
      return;
    }

    const request: RegisterRequest = {
      full_name: this.f['full_name'].value,
      email: this.f['email'].value,
      mobile_number: this.f['mobile_number'].value,
      role_id: this.roleMap[this.f['role'].value],
      password_hash: this.f['password'].value,
      status_id: this.defaultStatusId
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please log in.', 'Close', {
          duration: 3000,
          panelClass: 'snack-success'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.error?.message?.toLowerCase() || '';

        if (msg.includes('email') && msg.includes('exists')) {
          this.snackBar.open('Email already exists. Please use a different one.', 'Close', {
            duration: 3000,
            panelClass: 'snack-error'
          });
        } else {
          this.snackBar.open(err?.error?.message || 'Registration failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: 'snack-error'
          });
        }
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  // Predefined UUIDs from your roles and statuses tables
  private readonly roleMap: Record<string, string> = {
    Candidate: 'c1bb8df5-2c01-11f0-b60f-80ce6232908a',
    Recruiter: 'c1bb84ef-2c01-11f0-b60f-80ce6232908a'
  };
  private readonly defaultStatusId = 'b2fe49c1-2aeb-4a96-b661-e685366c4917'; // Under Review

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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

    const isValid = password === confirmPassword;
    return isValid ? null : { mismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      console.warn('Form is invalid', this.registerForm.errors, this.registerForm.value);
      return;
    }

    const request: RegisterRequest = {
      full_name: this.f['full_name'].value,
      email: this.f['email'].value,
      mobile_number: this.f['mobile_number'].value,
      role_id: this.roleMap[this.f['role'].value],
      password_hash: this.f['password'].value, // ✅ Corrected field name
      status_id: this.defaultStatusId
    };

    console.log('Sending registration request:', request);

    this.authService.register(request).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  message: string | null = null;
  messageType: 'success' | 'danger' | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
  if (this.forgotPasswordForm.invalid) {
    this.message = 'Please enter a valid email address.';
    this.messageType = 'danger';
    return;
  }

  const email = this.forgotPasswordForm.get('email')?.value;
  this.isSubmitting = true;
  this.message = null;
  this.messageType = null;

  this.authService.forgotPassword(email).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.message = 'Reset link sent to your email.';
      this.messageType = 'success';
      this.forgotPasswordForm.reset();
    },
    error: (err) => {
      this.isSubmitting = false;
      if (err.status === 404) {
        this.message = 'This email is not registered.';
      } else {
        this.message = 'Something went wrong. Please try again later.';
      }
      this.messageType = 'danger';
    }
  });
}

}

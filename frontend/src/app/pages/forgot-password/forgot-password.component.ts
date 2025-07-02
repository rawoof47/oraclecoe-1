import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
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

    // Reset previous messages
    this.message = null;
    this.messageType = null;
    
    this.isSubmitting = true;
    
    // Simulate API call (will be replaced with actual service)
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Always show success to prevent email enumeration
      this.message = 'If this email is registered, a reset link has been sent.';
      this.messageType = 'success';
      
      // Reset form after submission
      this.forgotPasswordForm.reset();
    }, 1500);
  }
}
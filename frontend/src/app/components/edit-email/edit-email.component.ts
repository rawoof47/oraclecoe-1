import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from '../../services/settings.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-edit-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss']
})
export class EditEmailComponent implements OnInit {
  emailForm!: FormGroup;
  userId: string | null = null;
  currentEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private authStateService: AuthStateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authStateService.getCurrentUser();
    this.userId = user?.id || null;
    this.currentEmail = user?.email || null;

    this.emailForm = this.fb.group({
      email: [this.currentEmail || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.emailForm.valid && this.userId) {
      const newEmail = this.emailForm.value.email;
      this.settingsService.updateEmail(this.userId, newEmail).subscribe({
        next: () => this.snackBar.open('Email updated!', 'Close', { duration: 3000 }),
        error: () => this.snackBar.open(' Failed to update email', 'Close', { duration: 3000 })
      });
    }
  }
}

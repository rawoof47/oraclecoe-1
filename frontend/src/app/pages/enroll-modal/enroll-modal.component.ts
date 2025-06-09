// src/app/pages/enroll-modal/enroll-modal.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course, ModeType } from 'src/app/shared/models/training.model';

@Component({
  selector: 'app-enroll-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enroll-modal.component.html',
  styleUrls: ['./enroll-modal.component.scss']
})
export class EnrollModalComponent {
  @Input() show: boolean = false;           // ✅ Added
  @Input() course!: Course;                 // ✅ Added
  @Input() mode: ModeType = 'online';       // ✅ Added
  @Output() close = new EventEmitter<void>();
  @Input() courseName: string = '';
  @Input() selectedMode: ModeType = 'online';


  form: FormGroup;
  isSubmitting = false;
  success = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      resume: [null]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ resume: file });
  }

  submit() {
    if (this.form.invalid) return;

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.success = true;
      setTimeout(() => this.close.emit(), 2000); // Auto-close
    }, 1500);
  }
}

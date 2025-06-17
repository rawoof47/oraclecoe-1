import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
   imports: [
    RouterModule, 
    CommonModule,
    ReactiveFormsModule,             // ✅ Added to fix routerLinkActiveOptions error
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    // PageBannerComponent, // Uncomment if used in template
  ],
  
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss']
})
export class RecruiterProfileComponent {
  recruiterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.recruiterForm = this.fb.group({
      // Company Info
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      companySize: ['', Validators.required],
      website: ['', Validators.required],
      companyDescription: ['', Validators.required],

      // Recruiter Info
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.recruiterForm.valid) {
      console.log('Form Submitted:', this.recruiterForm.value);
    } else {
      this.recruiterForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}

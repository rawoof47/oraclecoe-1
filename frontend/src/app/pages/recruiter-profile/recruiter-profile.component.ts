// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NavbarComponent } from '../../common/navbar/navbar.component';
// import { FooterComponent } from '../../common/footer/footer.component';
// import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
// import { RouterModule } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { RecruiterProfileService } from '../../services/recruiter-profile.service';

// @Component({
//   selector: 'app-recruiter-profile',
//   standalone: true,
//   imports: [
//     RouterModule,
//     CommonModule,
//     ReactiveFormsModule,
//     HttpClientModule,
//     NavbarComponent,
//     FooterComponent,
//     BackToTopComponent,
//   ],
//   templateUrl: './recruiter-profile.component.html',
//   styleUrls: ['./recruiter-profile.component.scss']
// })
// export class RecruiterProfileComponent {
//   recruiterForm: FormGroup;
//   private statusId = '34300a44-4775-11f0-8520-ac1f6bbcd360'; // ✅ Replace with your actual status_id

//   constructor(
//     private fb: FormBuilder,
//     private recruiterProfileService: RecruiterProfileService
//   ) {
//     this.recruiterForm = this.fb.group({
//       companyName: ['', Validators.required],
//       industry: ['', Validators.required],
//       companySize: ['', Validators.required],
//       website: ['', Validators.required],
//       companyDescription: ['', Validators.required],

//       firstName: ['', Validators.required],
//       middleName: [''],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       position: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.recruiterForm.invalid) {
//       this.recruiterForm.markAllAsTouched();
//       return;
//     }

//     const userId = localStorage.getItem('userId');
//     if (!userId) {
//       alert('User ID not found in local storage.');
//       return;
//     }

//     const formData = this.recruiterForm.value;

//     const profileData = {
//       user_id: userId,
//       company_name: formData.companyName,
//       industry: formData.industry,
//       company_size: formData.companySize,
//       website: formData.website,
//       company_description: formData.companyDescription,
//       recruiter_email: formData.email,
//       recruiter_position: formData.position,
//       status_id: this.statusId,
//       created_by: userId,
//     };

//     this.recruiterProfileService.createRecruiterProfile(profileData).subscribe({
//       next: () => {
//         alert('Recruiter profile saved successfully!');
//         this.recruiterForm.reset();
//       },
//       error: (error) => {
//         console.error(error);
//         alert('Failed to save recruiter profile.');
//       }
//     });
//   }
// }



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// ✅ Correct import path and usage
import { ForgotPasswordComponent } from '../../pages/forgot-password/forgot-password.component';

@NgModule({
  // ❌ Remove declarations
  // declarations: [],

  // ✅ Add the standalone component in imports
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ForgotPasswordComponent,  // ✅ treated like a module
    MatSnackBarModule // ✅ Material module for snack bar notifications
    
  ],

  // ✅ Optional: export if other modules need it
  exports: [ForgotPasswordComponent]
})
export class AuthModule {}

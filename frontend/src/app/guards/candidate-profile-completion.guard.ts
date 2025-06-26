import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { CandidateProfileService } from '../services/candidate-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileCompletionGuard implements CanActivate {
  private candidateProfileService = inject(CandidateProfileService);
  private authState = inject(AuthStateService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  canActivate(): Observable<boolean | UrlTree> {
    const COMPLETED_STATUS = '5e04d3c0-3993-11f0-a36b-80ce6232908a';

    // Skip check for non-candidates
    if (this.authState.getCurrentUserRole() !== 'candidate') {
      return of(true);
    }

    return this.candidateProfileService.getMyProfile().pipe(
      map(profile => {
        if (profile.status_id === COMPLETED_STATUS) {
          return true; // Allow navigation
        } else {
          this.showSnackBar();
          return this.router.createUrlTree(['/candidate-profile']);
        }
      }),
      catchError(() => {
        this.showSnackBar();
        return of(this.router.createUrlTree(['/candidate-profile']));
      })
    );
  }

  private showSnackBar(): void {
    this.snackBar.open('Please complete your profile.', 'Close', {
      duration: 5000,
     horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snack-info'
    });
  }
}
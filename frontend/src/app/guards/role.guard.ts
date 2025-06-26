import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { map, take } from 'rxjs';

// Update to accept multiple roles
export function roleGuard(...expectedRoles: ('candidate' | 'recruiter')[]): CanActivateFn {
  return () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    return authStateService.userRole$.pipe(
      take(1),
      map(role => {
        // Narrow role to valid values only
        if (role === 'candidate' || role === 'recruiter') {
          if (expectedRoles.includes(role)) {
            return true;
          }
        }

        router.navigate(['/']);
        return false;
      })
    );
  };
}

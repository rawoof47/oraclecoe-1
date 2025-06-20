import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { map, take } from 'rxjs';

/**
 * Role-based route guard supporting one or multiple roles.
 * Example: roleGuard('candidate'), roleGuard('recruiter'), or roleGuard('candidate', 'recruiter')
 */
export function roleGuard(...allowedRoles: ('candidate' | 'recruiter')[]): CanActivateFn {
  return () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    return authStateService.userRole$.pipe(
      take(1),
      map(role => {
        if (!allowedRoles.includes(role as any)) {
          router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  };
}

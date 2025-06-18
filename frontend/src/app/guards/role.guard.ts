import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { map, take } from 'rxjs';

export function roleGuard(expectedRoles: ('candidate' | 'recruiter' | 'admin')[]): CanActivateFn {
  return () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    return authStateService.userRole$.pipe(
      take(1),
      map(role => {
        if (!expectedRoles.includes(role as any)) {
          router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  };
}


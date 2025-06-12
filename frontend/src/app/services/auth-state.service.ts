import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  id: string;
  role: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly isBrowser = typeof window !== 'undefined';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  constructor() {
    if (this.isBrowser) {
      this.restoreStateFromLocalStorage();
    }
  }

  restoreStateFromLocalStorage() {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      const user: User = JSON.parse(userJson);
      this.isLoggedInSubject.next(true);
      this.userRoleSubject.next(user.role);
      this.userIdSubject.next(user.id);
    }
  }

  clearAuthState() {
    if (!this.isBrowser) return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.userIdSubject.next(null);
  }

  setAuthState(token: string, user: User) {
    if (!this.isBrowser) return;

    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.isLoggedInSubject.next(true);
    this.userRoleSubject.next(user.role);
    this.userIdSubject.next(user.id);
  }

  hasValidToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('access_token');
  }

  // ✅ New method to get current user synchronously
  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // ✅ New method to get user ID synchronously
  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  // ✅ New method to get user role
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // auth-state.service.ts
getAccessToken(): string | null {
  if (!this.isBrowser) return null;
  return localStorage.getItem('access_token');
}
}
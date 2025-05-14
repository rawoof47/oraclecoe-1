import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly isBrowser = typeof window !== 'undefined'; // ✅ SSR check

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
    const role = localStorage.getItem('role');
    const uuid = localStorage.getItem('user_id');

    if (token) {
      this.isLoggedInSubject.next(true);
      this.userRoleSubject.next(role);
      this.userIdSubject.next(uuid);
    }
  }

  clearAuthState() {
    if (!this.isBrowser) return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');

    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.userIdSubject.next(null);
  }

  setAuthState(token: string, role: string, uuid: string) {
    if (!this.isBrowser) return;

    localStorage.setItem('access_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', uuid);

    this.isLoggedInSubject.next(true);
    this.userRoleSubject.next(role);
    this.userIdSubject.next(uuid);
  }

  hasValidToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('access_token');
  }
}

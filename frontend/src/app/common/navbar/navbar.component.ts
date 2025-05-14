import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf,
    AsyncPipe // ✅ Required for using | async in template
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isSticky = false;
  navbarToggleClassApplied = false;

  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string | null>;

  constructor(
    public router: Router,
    private authStateService: AuthStateService
  ) {
    // Subscribe to authentication state
    this.isLoggedIn$ = this.authStateService.isLoggedIn$;
    this.userRole$ = this.authStateService.userRole$;

    // Restore auth state on component load
    this.authStateService.restoreStateFromLocalStorage();
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isSticky = scrollPosition >= 50;
  }

  navbarToggleClass() {
    this.navbarToggleClassApplied = !this.navbarToggleClassApplied;
  }

  logout() {
    this.authStateService.clearAuthState();
    this.router.navigate(['/login']);
  }
}

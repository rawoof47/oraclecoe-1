import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { Observable, of } from 'rxjs';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserCircle, 
  faSignOutAlt, 
  faUser, 
  faCog, 
  faBell 
} from '@fortawesome/free-solid-svg-icons';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    //NgClass,
    MatIconModule,
    //NgIf,
    //AsyncPipe,
    FontAwesomeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  // Existing properties
  isSticky = false;
  navbarToggleClassApplied = false;
  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string | null>;

  // New feature properties (additions only)
  unreadNotifications$: Observable<number> = of(3); // Replace with actual service
  currentTheme: 'light' | 'dark' = 'light';
  searchQuery = '';
  isSearchFocused = false;

  constructor(
    public router: Router,
    private authStateService: AuthStateService,
    private library: FaIconLibrary
  ) {
    library.addIcons(faUserCircle, faSignOutAlt, faUser, faCog, faBell);
    this.isLoggedIn$ = this.authStateService.isLoggedIn$;
    this.userRole$ = this.authStateService.userRole$;
    this.authStateService.restoreStateFromLocalStorage();
  }

  // Existing methods
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isSticky = scrollPosition >= 50;
  }

  navbarToggleClass() {
    this.navbarToggleClassApplied = !this.navbarToggleClassApplied;
  }

  logout() {
    this.authStateService.clearAuthState();
    this.router.navigate(['/login']);
  }

  // New feature methods (additions only)
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }
}
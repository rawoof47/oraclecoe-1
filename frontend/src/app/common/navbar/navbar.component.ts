import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { Observable } from 'rxjs';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserCircle, 
  faSignOutAlt, 
  faUser, 
  faCog, 
  faBell,
  faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    MatIconModule ,
    NgIf,
    AsyncPipe,
    FontAwesomeModule // ✅ Added Font Awesome module
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
    private authStateService: AuthStateService,
    private library: FaIconLibrary // ✅ Injected FaIconLibrary
  ) {
    // Add icons to library
    library.addIcons(faUserCircle, faSignOutAlt, faUser, faCog, faBell, faTachometerAlt);

    // Auth state initialization
    this.isLoggedIn$ = this.authStateService.isLoggedIn$;
    this.userRole$ = this.authStateService.userRole$;
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
  
  isNavbarOpen = false;
  navbarToggleClass() {
    // this.navbarToggleClassApplied = !this.navbarToggleClassApplied;
      this.isNavbarOpen = !this.isNavbarOpen;
  }



  logout() {
    this.authStateService.clearAuthState();
    this.router.navigate(['/login']);
  }
}
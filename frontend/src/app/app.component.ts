import { Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { AuthStateService } from './services/auth-state.service'; // 👈 Adjust path if needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Alzo - Job Board Angular 19 Template';

  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private authStateService = inject(AuthStateService); // 👈 Inject AuthStateService

  constructor() {
    // Restore scroll position
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });

    // ✅ Restore auth state from localStorage on app load
    this.authStateService.restoreStateFromLocalStorage(); // ✅ correct method name

  }
}

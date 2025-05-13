import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, NgClass, NgIf],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(
        public router: Router
    ) {}

    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    // Navbar Toggle Toggle Class
    navbarToggleClassApplied = false;
    navbarToggleClass() {
        this.navbarToggleClassApplied = !this.navbarToggleClassApplied;
    }

}
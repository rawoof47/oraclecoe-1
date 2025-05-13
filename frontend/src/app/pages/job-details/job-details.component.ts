import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NgIf } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-job-details',
    imports: [RouterLink, NgIf, CarouselModule, NavbarComponent, FooterComponent, BackToTopComponent],
    templateUrl: './job-details.component.html',
    styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent {

    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }
    
    // Owl Carousel
    videoSlides: OwlOptions = {
        margin: 0,
        nav: true,
        loop: true,
        dots: false,
        items: 1,
        smartSpeed: 1000,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        navText: [
            "<i class='flaticon-left-arrow'></i>",
            "<i class='flaticon-right-arrow'></i>"
        ]
    }

}
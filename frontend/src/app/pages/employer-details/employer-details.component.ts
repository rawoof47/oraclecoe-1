import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-employer-details',
    imports: [RouterLink, CarouselModule, NavbarComponent, FooterComponent, BackToTopComponent],
    templateUrl: './employer-details.component.html',
    styleUrl: './employer-details.component.scss'
})
export class EmployerDetailsComponent {
    
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
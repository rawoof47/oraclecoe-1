import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-testimonials',
    imports: [CarouselModule],
    templateUrl: './testimonials.component.html',
    styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {

    // Owl Carousel
    testimonialsSlides: OwlOptions = {
		items: 1,
		loop: true,
		margin: 20,
		nav: true,
		dots: false,
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
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-partners',
    imports: [CarouselModule],
    templateUrl: './partners.component.html',
    styleUrl: './partners.component.scss'
})
export class PartnersComponent {

    // Owl Carousel
    partnersSlides: OwlOptions = {
		loop: true,
		margin: 0,
		nav: false,
		dots: false,
		smartSpeed: 1000,
		autoplay: true,
		autoplayTimeout: 4000,
		autoplayHoverPause: true,
        navText: [
			"<i class='flaticon-left-arrow'></i>",
			"<i class='flaticon-right-arrow'></i>"
        ],
        responsive: {
            0: {
                items: 2
            },
            515: {
                items: 3
            },
            695: {
                items: 4
            },
            935: {
                items: 5
            },
            1115: {
                items: 5
            }
        }
    }

}
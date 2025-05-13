import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-team',
    imports: [CarouselModule, RouterLink],
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss'
})
export class TeamComponent {

    // Owl Carousel
    teamSlides: OwlOptions = {
		loop: true,
		margin: 25,
		nav: true,
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
                items: 1
            },
            515: {
                items: 1
            },
            695: {
                items: 1
            },
            935: {
                items: 2
            },
            1115: {
                items: 2
            }
        }
    }

}
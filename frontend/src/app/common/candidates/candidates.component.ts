import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-candidates',
    imports: [RouterLink, CarouselModule],
    templateUrl: './candidates.component.html',
    styleUrl: './candidates.component.scss'
})
export class CandidatesComponent {

    // Owl Carousel
    candidatesSlides: OwlOptions = {
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
        ],
        responsive: {
            0: {
                items: 1
            },
            515: {
                items: 1
            },
            695: {
                items: 2
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
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-feedback',
    imports: [CarouselModule],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

    // Owl Carousel
    feedbackSlides: OwlOptions = {
		margin: 0,
		nav: true,
		loop: true,
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
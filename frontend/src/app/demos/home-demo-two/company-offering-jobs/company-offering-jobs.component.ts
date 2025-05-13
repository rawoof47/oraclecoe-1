import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-company-offering-jobs',
    imports: [RouterLink, CarouselModule],
    templateUrl: './company-offering-jobs.component.html',
    styleUrl: './company-offering-jobs.component.scss'
})
export class CompanyOfferingJobsComponent {

    // Owl Carousel
    jobsSlides: OwlOptions = {
		loop: true,
		margin: 15,
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
                items: 2
            },
            695: {
                items: 3
            },
            935: {
                items: 4
            },
            1115: {
                items: 5
            }
        }
    }

}
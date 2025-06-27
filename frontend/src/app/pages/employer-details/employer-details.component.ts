import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { AuthStateService } from '../../services/auth-state.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-employer-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        CarouselModule,
        NavbarComponent,
        FooterComponent,
        BackToTopComponent
    ],
    templateUrl: './employer-details.component.html',
    styleUrl: './employer-details.component.scss'
})
export class EmployerDetailsComponent implements OnInit {
    recruiterProfile: any;
    recruiterUser: any;
    isLoading = true;

    // Owl Carousel options
    videoSlides: OwlOptions = {
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        navText: ['<i class="flaticon-left-arrow"></i>', '<i class="flaticon-right-arrow"></i>'],
        responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 2 },
            1200: { items: 3 }
        }
    };

    constructor(
        private recruiterProfileService: RecruiterProfileService,
        private candidateProfileService: CandidateProfileService,
        private authState: AuthStateService
    ) {}

    ngOnInit(): void {
        // Prevent logic from running during SSR
        if (typeof window === 'undefined') {
            console.warn('Running in SSR - skipping token-dependent logic');
            return;
        }

        this.waitForTokenAndFetchData();
    }

    waitForTokenAndFetchData(retryCount = 0): void {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('access_token');
        console.log('Calling getMyProfile with token:', token);

        if (!token) {
            if (retryCount < 10) {
                console.warn('Token not found, retrying in 100ms...');
                setTimeout(() => this.waitForTokenAndFetchData(retryCount + 1), 100);
            } else {
                console.error('Token still not available after multiple retries.');
                this.isLoading = false;
            }
            return;
        }

        this.fetchRecruiterProfile();
        this.fetchUserDetails();
    }

    fetchRecruiterProfile(): void {
        this.recruiterProfileService.getMyProfile().subscribe({
            next: (profile) => {
                this.recruiterProfile = profile;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching profile:', error);
                this.isLoading = false;
            }
        });
    }

    fetchUserDetails(): void {
        const userId = this.authState.getCurrentUserId();
        if (userId) {
            this.candidateProfileService.getUser(userId).subscribe({
                next: (user) => {
                    this.recruiterUser = user;
                },
                error: (error) => {
                    console.error('Error fetching user details:', error);
                }
            });
        }
    }

    getFullName(): string {
        if (!this.recruiterUser) return 'Recruiter name';

        let fullName = this.recruiterUser.first_name || '';
        if (this.recruiterUser.middle_name) {
            fullName += ` ${this.recruiterUser.middle_name}`;
        }
        fullName += ` ${this.recruiterUser.last_name || ''}`;

        return fullName.trim();
    }
}

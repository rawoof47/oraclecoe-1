import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-testimonials',
    imports: [NavbarComponent, PageBannerComponent, FooterComponent, BackToTopComponent],
    templateUrl: './testimonials.component.html',
    styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {}
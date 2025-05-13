import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { JobsComponent } from './jobs/jobs.component';
import { ExploreComponent } from './explore/explore.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { FeaturedJobsComponent } from '../../common/featured-jobs/featured-jobs.component';
import { CompanyOfferingJobsComponent } from './company-offering-jobs/company-offering-jobs.component';
import { PricingComponent } from '../../common/pricing/pricing.component';
import { PartnersComponent } from './partners/partners.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { BlogComponent } from './blog/blog.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-home-demo-three',
    imports: [NavbarComponent, BannerComponent, JobsComponent, ExploreComponent, HowItWorksComponent, FeaturedJobsComponent, CompanyOfferingJobsComponent, PricingComponent, PartnersComponent, TestimonialsComponent, BlogComponent, FooterComponent, BackToTopComponent],
    templateUrl: './home-demo-three.component.html',
    styleUrl: './home-demo-three.component.scss'
})
export class HomeDemoThreeComponent {}
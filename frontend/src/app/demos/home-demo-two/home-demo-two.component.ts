import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { PartnersComponent } from './partners/partners.component';
import { CompanyOfferingJobsComponent } from './company-offering-jobs/company-offering-jobs.component';
import { ExploreComponent } from './explore/explore.component';
import { CategoriesComponent } from '../../common/categories/categories.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { JobsComponent } from './jobs/jobs.component';
import { CandidatesComponent } from '../../common/candidates/candidates.component';
import { CitiesComponent } from './cities/cities.component';
import { TestimonialsComponent } from '../../common/testimonials/testimonials.component';
import { FunfactsComponent } from './funfacts/funfacts.component';
import { BlogComponent } from './blog/blog.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-home-demo-two',
    imports: [NavbarComponent, BannerComponent, PartnersComponent, CompanyOfferingJobsComponent, ExploreComponent, CategoriesComponent, HowItWorksComponent, JobsComponent, CandidatesComponent, CitiesComponent, TestimonialsComponent, BlogComponent, FunfactsComponent, FooterComponent, BackToTopComponent],
    templateUrl: './home-demo-two.component.html',
    styleUrl: './home-demo-two.component.scss'
})
export class HomeDemoTwoComponent {}
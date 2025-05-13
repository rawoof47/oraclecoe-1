import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { HowItWorksComponent } from '../../common/how-it-works/how-it-works.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { JobsComponent } from '../../common/jobs/jobs.component';
import { ExploreComponent } from '../../common/explore/explore.component';
import { FunfactsComponent } from '../../common/funfacts/funfacts.component';
import { CompanyOfferingJobsComponent } from '../../common/company-offering-jobs/company-offering-jobs.component';
import { CitiesComponent } from '../../common/cities/cities.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { BlogComponent } from '../../common/blog/blog.component';
import { PartnersComponent } from '../../common/partners/partners.component';
import { MobileAppComponent } from '../../common/mobile-app/mobile-app.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-home-demo-one',
    imports: [NavbarComponent, BannerComponent, HowItWorksComponent, JobsComponent, ExploreComponent, FunfactsComponent, CompanyOfferingJobsComponent, CitiesComponent, FeedbackComponent, BlogComponent, PartnersComponent, MobileAppComponent, FooterComponent, BackToTopComponent],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss'
})
export class HomeDemoOneComponent {}
import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { RouterLink } from '@angular/router';
import { FunfactsComponent } from '../../common/funfacts/funfacts.component';
import { CompanyPossibilitiesComponent } from '../../common/company-possibilities/company-possibilities.component';
import { ExploreComponent } from '../../common/explore/explore.component';
import { TeamComponent } from '../../common/team/team.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-about-us',
    imports: [RouterLink, NavbarComponent, PageBannerComponent, FunfactsComponent, CompanyPossibilitiesComponent, ExploreComponent, TeamComponent, FooterComponent, BackToTopComponent],
    templateUrl: './about-us.component.html',
    styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {}
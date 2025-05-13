import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-jobs',
    imports: [RouterLink, NavbarComponent, PageBannerComponent, FooterComponent, BackToTopComponent],
    templateUrl: './jobs.component.html',
    styleUrl: './jobs.component.scss'
})
export class JobsComponent {}
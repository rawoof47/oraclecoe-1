import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-single-resume',
    imports: [NavbarComponent, PageBannerComponent, FooterComponent, BackToTopComponent],
    templateUrl: './single-resume.component.html',
    styleUrl: './single-resume.component.scss'
})
export class SingleResumeComponent {}
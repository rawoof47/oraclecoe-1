import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';

@Component({
    selector: 'app-contact-us',
    imports: [NavbarComponent, PageBannerComponent, ContactInfoComponent, FooterComponent, BackToTopComponent],
    templateUrl: './contact-us.component.html',
    styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {}
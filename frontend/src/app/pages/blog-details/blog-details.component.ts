import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { SidebarWidgetComponent } from '../../common/sidebar-widget/sidebar-widget.component';

@Component({
    selector: 'app-blog-details',
    imports: [RouterLink, NavbarComponent, PageBannerComponent, SidebarWidgetComponent, FooterComponent, BackToTopComponent],
    templateUrl: './blog-details.component.html',
    styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent {}
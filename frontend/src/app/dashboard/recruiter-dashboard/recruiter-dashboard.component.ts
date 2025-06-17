// recruiter-dashboard.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { RecruiterSidebarComponent  } from '../../common/recruiter-sidebar/recruiter-sidebar.component';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [
    RouterModule,              // ✅ Added to fix routerLinkActiveOptions error
    NavbarComponent, 
    PageBannerComponent, 
    FooterComponent, 
    BackToTopComponent,
    RecruiterSidebarComponent
  ],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent {
  // Static component - no functionality needed
}

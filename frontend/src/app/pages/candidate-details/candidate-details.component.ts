import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-candidate-details',
    imports: [RouterLink, NavbarComponent, FooterComponent, BackToTopComponent],
    templateUrl: './candidate-details.component.html',
    styleUrl: './candidate-details.component.scss'
})
export class CandidateDetailsComponent {}
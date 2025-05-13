import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, NgIf, NgClass],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

    constructor(
        public router: Router
    ) {}

}
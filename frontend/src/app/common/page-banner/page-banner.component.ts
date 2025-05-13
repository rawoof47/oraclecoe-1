import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page-banner',
    imports: [RouterLink, NgStyle],
    templateUrl: './page-banner.component.html',
    styleUrl: './page-banner.component.scss'
})
export class PageBannerComponent {

    @Input() pageTitle: string = '';
    @Input() backgroundImage: string = '';

}
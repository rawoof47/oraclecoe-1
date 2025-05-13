import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-company-offering-jobs',
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './company-offering-jobs.component.html',
    styleUrl: './company-offering-jobs.component.scss'
})
export class CompanyOfferingJobsComponent {

    // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}
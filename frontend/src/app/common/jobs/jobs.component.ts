import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-jobs',
    imports: [RouterLink, NgIf, NgClass],
    templateUrl: './jobs.component.html',
    styleUrl: './jobs.component.scss'
})
export class JobsComponent {

    // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}
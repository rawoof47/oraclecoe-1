import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-categories',
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

    // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}
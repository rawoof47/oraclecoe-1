import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-explore',
    imports: [RouterLink, NgIf],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.scss'
})
export class ExploreComponent {

    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }

}
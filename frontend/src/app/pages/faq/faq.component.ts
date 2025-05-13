import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from '../../common/page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'app-faq',
    imports: [RouterLink, NgFor, NgClass, NavbarComponent, PageBannerComponent, FooterComponent, BackToTopComponent],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FaqComponent {

    // Accordion
    accordionItems = [
        {
            title: `What's your ideal about company?`,
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quaerat natus, enim nobis perspiciatis iste possimus nemo doloremque tempore deleniti fugit? In delectus, accusantium facilis quae saepe commodi ipsum fuga.`,
            open: false
        },
        {
            title: `Why should we hire you?`,
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quaerat natus, enim nobis perspiciatis iste possimus nemo doloremque tempore deleniti fugit? In delectus, accusantium facilis quae saepe commodi ipsum fuga.`,
            open: false
        },
        {
            title: `What do we serve from our company?`,
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quaerat natus, enim nobis perspiciatis iste possimus nemo doloremque tempore deleniti fugit? In delectus, accusantium facilis quae saepe commodi ipsum fuga.`,
            open: false
        },
        {
            title: `Why do you want to work here?`,
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quaerat natus, enim nobis perspiciatis iste possimus nemo doloremque tempore deleniti fugit? In delectus, accusantium facilis quae saepe commodi ipsum fuga.`,
            open: false
        },
        {
            title: `When will you be most satisfied in our job?`,
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quaerat natus, enim nobis perspiciatis iste possimus nemo doloremque tempore deleniti fugit? In delectus, accusantium facilis quae saepe commodi ipsum fuga.`,
            open: false
        },
        {
            title: `What attracted me to this company?`,
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quaerat natus, enim nobis perspiciatis iste possimus nemo doloremque tempore deleniti fugit? In delectus, accusantium facilis quae saepe commodi ipsum fuga.`,
            open: false
        }
    ];
    selectedItem : any = null;
    toggleAccordionItem(item:any) {
        item.open = !item.open;
        if (this.selectedItem && this.selectedItem !== item) {
            this.selectedItem.open = false;
        }
        this.selectedItem = item;
    }

}
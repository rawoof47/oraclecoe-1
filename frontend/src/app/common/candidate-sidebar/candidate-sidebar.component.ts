import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-sidebar.component.html',
  styleUrls: ['./candidate-sidebar.component.scss']
})
export class CandidateSidebarComponent { }
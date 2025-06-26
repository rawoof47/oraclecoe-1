import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service'; // Adjust path

@Component({
  selector: 'app-candidate-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-sidebar.component.html',
  styleUrls: ['./candidate-sidebar.component.scss']
})
export class CandidateSidebarComponent implements OnInit {
  firstName: string = '';
  profileImage: string = 'img/dashboard3.png'; // Use existing image path


  constructor(private authState: AuthStateService) {}

  ngOnInit() {
  const user = this.authState.getCurrentUser();
  if (user) {
    this.firstName = user.first_name || 'User';
  }
}
}
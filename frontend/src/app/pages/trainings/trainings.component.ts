import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrainingsService } from 'src/app/services/trainings.service';
import { Course } from 'src/app/shared/models/training.model';


@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {
  courses: Course[] = [];

  constructor(private trainingsService: TrainingsService) {}

  ngOnInit(): void {
    this.trainingsService.getAllTrainings().subscribe(data => {
      this.courses = data;
    });
  }
}

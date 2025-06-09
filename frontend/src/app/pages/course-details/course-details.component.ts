// src/app/pages/course-details/course-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollModalComponent } from 'src/app/pages/enroll-modal/enroll-modal.component';
import { TrainingsService } from 'src/app/services/trainings.service';
import { Course } from 'src/app/shared/models/training.model';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EnrollModalComponent // ✅ Must import this
  ],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | undefined;
  selectedMode: 'online' | 'office' | 'hybrid' = 'online';
  showEnrollModal = false;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trainingService.getTrainingById(id).subscribe((data) => {
        this.course = data;
      });
    }
  }
}

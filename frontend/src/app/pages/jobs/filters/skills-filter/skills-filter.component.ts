import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-skills-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './skills-filter.component.html',
  styleUrls: ['./skills-filter.component.scss']
})
export class SkillsFilterComponent implements OnInit {
  skills: string[] = []; // Replace string[] with actual Skill[] if needed
  selectedSkills: string[] = [];

  ngOnInit(): void {
    // Simulate skill fetch - replace with real API call
    this.skills = [
      'JavaScript',
      'Angular',
      'Node.js',
      'Python',
      'Java',
      'React',
      'SQL',
      'AWS'
    ];
  }

  onSkillsChange(): void {
    // Local filter logic or fetch filtered jobs via API here
    console.log('Selected skills:', this.selectedSkills);

    // Optionally, make an API call here to get filtered jobs
    // and emit it via an @Output() if you ever want to notify the parent
  }
}

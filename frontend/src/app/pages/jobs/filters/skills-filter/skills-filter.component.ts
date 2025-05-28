import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobPostService } from '../../../../services/job-post.service';

interface GroupedItem {
  categoryName: string;
  items: any[];
}

@Component({
  selector: 'app-skills-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills-filter.component.html',
  styleUrls: ['./skills-filter.component.scss']
})
export class SkillFiltersComponent implements OnInit {
  // Grouped dropdown arrays
  groupedSkills: GroupedItem[] = [];
  groupedCertifications: GroupedItem[] = [];

  // Selected values
  selectedSkills: any[] = [];
  selectedCertifications: any[] = [];

  // Dropdown toggles
  showSkillsDropdown = false;
  showCertsDropdown = false;

  constructor(private jobPostService: JobPostService) {}

  ngOnInit(): void {
    this.loadSkillsByCategory();
    this.loadCertificationsByCategory();
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  toggleCertsDropdown(): void {
    this.showCertsDropdown = !this.showCertsDropdown;
  }

  onSkillChange(skill: any): void {
    if (skill.selected) {
      this.selectedSkills.push(skill);
    } else {
      this.selectedSkills = this.selectedSkills.filter(s => s.id !== skill.id);
    }
  }

  onCertChange(cert: any): void {
    if (cert.selected) {
      this.selectedCertifications.push(cert);
    } else {
      this.selectedCertifications = this.selectedCertifications.filter(c => c.id !== cert.id);
    }
  }

  private loadSkillsByCategory(): void {
    const skillCategories = [
      { id: '612222a1-791a-4125-be8d-1d86808a37bf', name: 'Functional Skills' },
      { id: 'b9677d69-356f-11f0-bd34-80ce6232908a', name: 'Technical Skills' },
      { id: '0ec31fb0-3591-11f0-ae4b-80ce6232908a', name: 'Oracle Middleware Skills' },
      { id: '843a8e1d-3591-11f0-ae4b-80ce6232908a', name: 'Reporting Skills' }
    ];

    skillCategories.forEach(category => {
      this.jobPostService.getFunctionalSkills(category.id).subscribe({
        next: (data: any[]) => {
          this.groupedSkills.push({
            categoryName: category.name,
            items: data.map(item => ({ ...item, selected: false })) || []
          });
        },
        error: (err) => {
          console.error(`❌ Failed to load skills for ${category.name}:`, err);
        }
      });
    });
  }

  private loadCertificationsByCategory(): void {
    const certCategories = [
      { id: 'ed7c50c7-36d3-11f0-bfce-80ce6232908a', name: 'Financial Certifications' },
      { id: 'ed7c5c88-36d3-11f0-bfce-80ce6232908a', name: 'HCM Certifications' },
      { id: 'ed7c5da6-36d3-11f0-bfce-80ce6232908a', name: 'SCM Certifications' },
      { id: 'ed7c5e82-36d3-11f0-bfce-80ce6232908a', name: 'CX Certifications' }
    ];

    certCategories.forEach(category => {
      this.jobPostService.getCertificationsByCategory(category.id).subscribe({
        next: (data: any[]) => {
          this.groupedCertifications.push({
            categoryName: category.name,
            items: data.map(item => ({ ...item, selected: false })) || []
          });
        },
        error: (err) => {
          console.error(`❌ Failed to load certifications for ${category.name}:`, err);
        }
      });
    });
  }
}

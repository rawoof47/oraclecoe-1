import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  groupedSkills: GroupedItem[] = [];
  groupedCertifications: GroupedItem[] = [];

  selectedSkills: any[] = [];
  selectedCertifications: any[] = [];

  showSkillsDropdown = false;
  showCertsDropdown = false;

  jobSkillMappings: { job_post_id: string; skill_id: string }[] = [];
  jobCertMappings: { job_post_id: string; certification_id: string }[] = [];

  @Output() filteredJobIds = new EventEmitter<string[]>();
  @Output() filtersChanged = new EventEmitter<{ skillIds: string[]; certIds: string[] }>();

  constructor(private jobPostService: JobPostService) {}

  ngOnInit(): void {
    console.log('🔄 Initializing SkillFiltersComponent...');

    this.loadJobMappings();
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
    skill.selected = !skill.selected;
    console.log(`📌 Skill selection changed:`, skill);

    if (skill.selected) {
      this.selectedSkills.push(skill);
    } else {
      this.selectedSkills = this.selectedSkills.filter(s => s.id !== skill.id);
    }

    this.emitFilters();
  }

  onCertChange(cert: any): void {
    cert.selected = !cert.selected;
    console.log(`📌 Certification selection changed:`, cert);

    if (cert.selected) {
      this.selectedCertifications.push(cert);
    } else {
      this.selectedCertifications = this.selectedCertifications.filter(c => c.id !== cert.id);
    }

    this.emitFilters();
  }

  private emitFilters(): void {
    const selectedSkillIds = this.selectedSkills.map(s => s.id);
    const selectedCertIds = this.selectedCertifications.map(c => c.id);

    this.filtersChanged.emit({
      skillIds: selectedSkillIds,
      certIds: selectedCertIds
    });

    console.log('🔍 jobSkillMappings:', this.jobSkillMappings);
    console.log('🔍 jobCertMappings:', this.jobCertMappings);
    console.log('✅ Selected Skill IDs:', selectedSkillIds);
    console.log('✅ Selected Certification IDs:', selectedCertIds);

    const jobIdsFromSkills = selectedSkillIds.length
      ? this.jobSkillMappings
          .filter(m => selectedSkillIds.includes(m.skill_id))
          .map(m => m.job_post_id)
      : [];

    const jobIdsFromCerts = selectedCertIds.length
      ? this.jobCertMappings
          .filter(m => selectedCertIds.includes(m.certification_id))
          .map(m => m.job_post_id)
      : [];

    const mergedIds = new Set([...jobIdsFromSkills, ...jobIdsFromCerts]);
    const filteredIds = [...mergedIds];

    console.log('🚀 Emitting filtered job post IDs:', filteredIds);
    this.filteredJobIds.emit(filteredIds);
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
          console.log(`✅ Loaded ${category.name}:`, data);
          this.groupedSkills.push({
            categoryName: category.name,
            items: data.map(item => ({ ...item, selected: false }))
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
          console.log(`✅ Loaded ${category.name}:`, data);
          const mappedItems = data.map(item => ({
            id: item.id,
            name: item.certification_name,
            selected: false
          }));
          this.groupedCertifications.push({
            categoryName: category.name,
            items: mappedItems
          });
        },
        error: (err) => {
          console.error(`❌ Failed to load certifications for ${category.name}:`, err);
        }
      });
    });
  }

  private loadJobMappings(): void {
    this.jobPostService.getJobPostSkills().subscribe({
      next: (data: any[]) => {
        console.log('✅ Job skill mappings loaded:', data);
        this.jobSkillMappings = data;
      },
      error: (err) => console.error('❌ Failed to load job post skills:', err),
    });

    this.jobPostService.getJobPostCertifications().subscribe({
      next: (data: any[]) => {
        console.log('✅ Raw certification mappings:', data);

        this.jobCertMappings = data.map(item => ({
          job_post_id: item.job_post_id,
          certification_id: item.certification_id || item.certId || item.id
        }));

        console.log('✅ Processed job certification mappings:', this.jobCertMappings);
      },
      error: (err) => console.error('❌ Failed to load job post certifications:', err),
    });
  }
}

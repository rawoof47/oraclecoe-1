import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostTrainingsService } from '../../services/post-trainings.service';

@Component({
  selector: 'app-post-trainings',
  templateUrl: './post-trainings.component.html',
  styleUrls: ['./post-trainings.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PostTrainingsComponent implements OnInit {
  trainingForm!: FormGroup;

  trainingModes = ['online', 'offline', 'hybrid'];
  trainingTypes = ['technical', 'functional', 'integration'];
  modulesList = ['Module 1', 'Module 2', 'Module 3', 'Module 4'];
  featuresList = ['Job Support', 'Certification', 'Project'];

  constructor(
    private fb: FormBuilder,
    private trainingService: PostTrainingsService
  ) {}

  ngOnInit(): void {
    this.trainingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      mode: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      registration_deadline: ['', Validators.required],
      fee: ['', [Validators.required, Validators.min(0)]],
      duration: [''],
      batch_size: [''],
      training_type: ['', Validators.required],
      trainer: [''],
      modules: this.buildModules(),
      status: ['active', Validators.required],
      features: this.buildFeatures()
    });
  }

  buildModules() {
    return this.fb.array(this.modulesList.map(() => this.fb.control(false)));
  }

  buildFeatures() {
    return this.fb.array(this.featuresList.map(() => this.fb.control(false)));
  }

  get modulesFormArray() {
    return this.trainingForm.get('modules') as FormArray;
  }

  get featuresFormArray() {
    return this.trainingForm.get('features') as FormArray;
  }

  onSubmit() {
    if (this.trainingForm.invalid) {
      this.trainingForm.markAllAsTouched();
      return;
    }

    const selectedModules = this.trainingForm.value.modules
      .map((checked: boolean, i: number) => (checked ? this.modulesList[i] : null))
      .filter((v: string | null) => v !== null);

    const selectedFeatures = this.trainingForm.value.features
      .map((checked: boolean, i: number) => (checked ? this.featuresList[i] : null))
      .filter((v: string | null) => v !== null);

    const formData = {
      ...this.trainingForm.value,
      modules: selectedModules.join(', '), // ✅ string format (DB expects string)
    features: selectedFeatures // ✅ array format (DB expects JSON array)
    };

    this.trainingService.postTraining(formData).subscribe({
      next: () => {
        alert('Training posted successfully!');
        this.trainingForm.reset();
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to post training.');
      }
    });
  }
}

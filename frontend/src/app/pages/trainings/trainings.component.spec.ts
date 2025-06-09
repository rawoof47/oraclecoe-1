// src/app/pages/trainings/trainings.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TrainingsComponent } from './trainings.component';
import { TrainingsService } from '../../services/trainings.service';

describe('TrainingsComponent', () => {
  let component: TrainingsComponent;
  let fixture: ComponentFixture<TrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingsComponent],
      imports: [ReactiveFormsModule],
      providers: [TrainingsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the trainings component', () => {
    expect(component).toBeTruthy();
  });

  it('should have trainings list populated', () => {
    expect(component.trainings.length).toBeGreaterThan(0);
  });

  it('should create registration form with 4 controls', () => {
    expect(component.registrationForm.contains('name')).toBeTruthy();
    expect(component.registrationForm.contains('email')).toBeTruthy();
    expect(component.registrationForm.contains('mobile')).toBeTruthy();
    expect(component.registrationForm.contains('resume')).toBeTruthy();
  });

  it('should make name control required', () => {
    const control = component.registrationForm.get('name');
    control?.setValue('');
    expect(control?.valid).toBeFalse();
  });

  it('should make email control required and validate email format', () => {
    const control = component.registrationForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalse();
    control?.setValue('invalidEmail');
    expect(control?.valid).toBeFalse();
    control?.setValue('test@example.com');
    expect(control?.valid).toBeTrue();
  });

  it('should validate mobile control for 10 digits', () => {
    const control = component.registrationForm.get('mobile');
    control?.setValue('12345');
    expect(control?.valid).toBeFalse();
    control?.setValue('9876543210');
    expect(control?.valid).toBeTrue();
  });
});

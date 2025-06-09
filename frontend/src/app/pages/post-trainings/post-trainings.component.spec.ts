import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTrainingsComponent } from './post-trainings.component';

describe('PostTrainingsComponent', () => {
  let component: PostTrainingsComponent;
  let fixture: ComponentFixture<PostTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTrainingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

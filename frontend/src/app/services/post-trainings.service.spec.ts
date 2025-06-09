import { TestBed } from '@angular/core/testing';

import { PostTrainingsService } from './post-trainings.service';

describe('PostTrainingsService', () => {
  let service: PostTrainingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostTrainingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

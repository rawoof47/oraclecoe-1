import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterProfilesService } from '../recruiter-profiles.service';

describe('RecruiterProfilesService', () => {
  let service: RecruiterProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruiterProfilesService],
    }).compile();

    service = module.get<RecruiterProfilesService>(RecruiterProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

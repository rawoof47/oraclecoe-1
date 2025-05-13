import { Test, TestingModule } from '@nestjs/testing';
import { CandidateProfilesService } from './candidate-profiles.service';

describe('CandidateProfilesService', () => {
  let service: CandidateProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateProfilesService],
    }).compile();

    service = module.get<CandidateProfilesService>(CandidateProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

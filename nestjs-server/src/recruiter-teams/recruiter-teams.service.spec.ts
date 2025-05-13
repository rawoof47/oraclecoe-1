import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterTeamsService } from './recruiter-teams.service';

describe('RecruiterTeamsService', () => {
  let service: RecruiterTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruiterTeamsService],
    }).compile();

    service = module.get<RecruiterTeamsService>(RecruiterTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JobPostSkillService } from './job-post-skill.service';

describe('JobPostSkillService', () => {
  let service: JobPostSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPostSkillService],
    }).compile();

    service = module.get<JobPostSkillService>(JobPostSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

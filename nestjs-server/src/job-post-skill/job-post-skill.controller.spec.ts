import { Test, TestingModule } from '@nestjs/testing';
import { JobPostSkillController } from './job-post-skill.controller';

describe('JobPostSkillController', () => {
  let controller: JobPostSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostSkillController],
    }).compile();

    controller = module.get<JobPostSkillController>(JobPostSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JobPostsController } from './job-posts.controller';

describe('JobPostsController', () => {
  let controller: JobPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostsController],
    }).compile();

    controller = module.get<JobPostsController>(JobPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

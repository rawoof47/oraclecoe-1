import { Test, TestingModule } from '@nestjs/testing';
import { JobShortlistsController } from './job-shortlists.controller';

describe('JobShortlistsController', () => {
  let controller: JobShortlistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobShortlistsController],
    }).compile();

    controller = module.get<JobShortlistsController>(JobShortlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

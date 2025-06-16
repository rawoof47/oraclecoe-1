import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterProfilesController } from '../recruiter-profiles.controller';

describe('RecruiterProfilesController', () => {
  let controller: RecruiterProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruiterProfilesController],
    }).compile();

    controller = module.get<RecruiterProfilesController>(RecruiterProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

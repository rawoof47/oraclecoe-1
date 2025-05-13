import { Test, TestingModule } from '@nestjs/testing';
import { CandidateProfilesController } from './candidate-profiles.controller';

describe('CandidateProfilesController', () => {
  let controller: CandidateProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateProfilesController],
    }).compile();

    controller = module.get<CandidateProfilesController>(CandidateProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

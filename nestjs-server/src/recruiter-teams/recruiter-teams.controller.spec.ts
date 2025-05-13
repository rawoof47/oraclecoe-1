import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterTeamsController } from './recruiter-teams.controller';

describe('RecruiterTeamsController', () => {
  let controller: RecruiterTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruiterTeamsController],
    }).compile();

    controller = module.get<RecruiterTeamsController>(RecruiterTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

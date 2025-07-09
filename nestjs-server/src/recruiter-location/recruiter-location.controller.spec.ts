import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterLocationController } from './recruiter-location.controller';

describe('RecruiterLocationController', () => {
  let controller: RecruiterLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruiterLocationController],
    }).compile();

    controller = module.get<RecruiterLocationController>(RecruiterLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

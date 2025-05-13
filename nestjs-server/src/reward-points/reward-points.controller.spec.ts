import { Test, TestingModule } from '@nestjs/testing';
import { RewardPointsController } from './reward-points.controller';

describe('RewardPointsController', () => {
  let controller: RewardPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardPointsController],
    }).compile();

    controller = module.get<RewardPointsController>(RewardPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

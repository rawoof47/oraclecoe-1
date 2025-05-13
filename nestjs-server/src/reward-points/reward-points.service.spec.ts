import { Test, TestingModule } from '@nestjs/testing';
import { RewardPointsService } from './reward-points.service';

describe('RewardPointsService', () => {
  let service: RewardPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardPointsService],
    }).compile();

    service = module.get<RewardPointsService>(RewardPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

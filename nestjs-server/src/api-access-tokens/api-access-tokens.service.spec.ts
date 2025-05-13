import { Test, TestingModule } from '@nestjs/testing';
import { ApiAccessTokensService } from './api-access-tokens.service';

describe('ApiAccessTokensService', () => {
  let service: ApiAccessTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiAccessTokensService],
    }).compile();

    service = module.get<ApiAccessTokensService>(ApiAccessTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

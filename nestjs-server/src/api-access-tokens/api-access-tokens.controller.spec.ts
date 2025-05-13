import { Test, TestingModule } from '@nestjs/testing';
import { ApiAccessTokensController } from './api-access-tokens.controller';

describe('ApiAccessTokensController', () => {
  let controller: ApiAccessTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiAccessTokensController],
    }).compile();

    controller = module.get<ApiAccessTokensController>(ApiAccessTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

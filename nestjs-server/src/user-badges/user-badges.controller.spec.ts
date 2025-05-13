import { Test, TestingModule } from '@nestjs/testing';
import { UserBadgesController } from './user-badges.controller';

describe('UserBadgesController', () => {
  let controller: UserBadgesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBadgesController],
    }).compile();

    controller = module.get<UserBadgesController>(UserBadgesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

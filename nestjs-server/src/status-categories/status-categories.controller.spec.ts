import { Test, TestingModule } from '@nestjs/testing';
import { StatusCategoriesController } from './status-categories.controller';

describe('StatusCategoriesController', () => {
  let controller: StatusCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusCategoriesController],
    }).compile();

    controller = module.get<StatusCategoriesController>(StatusCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

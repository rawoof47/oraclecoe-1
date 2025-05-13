import { Test, TestingModule } from '@nestjs/testing';
import { StatusCategoriesService } from './status-categories.service';

describe('StatusCategoriesService', () => {
  let service: StatusCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusCategoriesService],
    }).compile();

    service = module.get<StatusCategoriesService>(StatusCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

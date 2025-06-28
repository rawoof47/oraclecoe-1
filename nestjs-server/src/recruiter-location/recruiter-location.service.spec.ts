import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterLocationService } from './recruiter-location.service';

describe('RecruiterLocationService', () => {
  let service: RecruiterLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruiterLocationService],
    }).compile();

    service = module.get<RecruiterLocationService>(RecruiterLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

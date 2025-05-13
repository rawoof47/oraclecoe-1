import { Test, TestingModule } from '@nestjs/testing';
import { JobShortlistsService } from './job-shortlists.service';

describe('JobShortlistsService', () => {
  let service: JobShortlistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobShortlistsService],
    }).compile();

    service = module.get<JobShortlistsService>(JobShortlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

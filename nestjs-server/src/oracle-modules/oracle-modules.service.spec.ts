import { Test, TestingModule } from '@nestjs/testing';
import { OracleModulesService } from './oracle-modules.service';

describe('OracleModulesService', () => {
  let service: OracleModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleModulesService],
    }).compile();

    service = module.get<OracleModulesService>(OracleModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

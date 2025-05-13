import { Test, TestingModule } from '@nestjs/testing';
import { OracleModulesController } from './oracle-modules.controller';

describe('OracleModulesController', () => {
  let controller: OracleModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OracleModulesController],
    }).compile();

    controller = module.get<OracleModulesController>(OracleModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OracleModulesService } from './oracle-modules.service';
import { OracleModulesController } from './oracle-modules.controller';
import { OracleModule } from './entities/oracle-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OracleModule])],
  controllers: [OracleModulesController],
  providers: [OracleModulesService],
})
export class OracleModulesModule {}

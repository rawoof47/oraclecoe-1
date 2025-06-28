import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { Region } from './region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [RegionsController],
  providers: [RegionsService],
})
export class RegionsModule {}

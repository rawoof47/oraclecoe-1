import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustriesController } from './industries.controller';
import { IndustriesService } from './industries.service';
import { Industry } from './entities/industry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  controllers: [IndustriesController],
  providers: [IndustriesService],
  exports: [IndustriesService] // Add this to make service available elsewhere
})
export class IndustriesModule {}
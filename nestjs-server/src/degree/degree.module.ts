import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreeController } from './degree.controller';
import { DegreeService } from './degree.service';
import { Degree } from './entities/degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Degree])],
  controllers: [DegreeController],
  providers: [DegreeService],
  exports: [DegreeService], // Optional: if other modules need this service
})
export class DegreeModule {}

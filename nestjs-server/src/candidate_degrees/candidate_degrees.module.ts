import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateDegreesController } from './candidate_degrees.controller';
import { CandidateDegreesService } from './candidate_degrees.service';
import { CandidateDegree } from './entity/candidate-degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateDegree])],
  controllers: [CandidateDegreesController],
  providers: [CandidateDegreesService],
  exports: [CandidateDegreesService],
})
export class CandidateDegreesModule {}

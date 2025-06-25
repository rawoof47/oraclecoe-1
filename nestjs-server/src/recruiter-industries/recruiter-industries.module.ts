import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterIndustriesService } from './recruiter-industries.service';
import { RecruiterIndustriesController } from './recruiter-industries.controller';
import { RecruiterIndustry } from './entities/recruiter-industry.entity';
import { Industry } from '../industries/entities/industry.entity';
import { RecruiterProfile } from '../recruiter-profile/entity/recruiter-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecruiterIndustry,
      Industry,
      RecruiterProfile,
    ]),
  ],
  controllers: [RecruiterIndustriesController],
  providers: [RecruiterIndustriesService],
})
export class RecruiterIndustriesModule {}

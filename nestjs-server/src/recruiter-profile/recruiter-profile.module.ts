import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterProfileController } from './recruiter-profile.controller';
import { RecruiterProfileService } from './recruiter-profile.service';
import { RecruiterProfile } from './entity/recruiter-profile.entity';
import { Status } from '../statuses/entities/status.entity';
import { RecruiterIndustry } from '../recruiter-industries/entities/recruiter-industry.entity'; // if used
import { AwsModule } from '../aws/aws.module'; // ✅ Import AwsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecruiterProfile,
      Status,
      RecruiterIndustry // ✅ if you're using industryIds
    ]),
    AwsModule, // ✅ Required for AwsService injection
  ],
  controllers: [RecruiterProfileController],
  providers: [RecruiterProfileService],
  exports: [RecruiterProfileService],
})
export class RecruiterProfileModule {}

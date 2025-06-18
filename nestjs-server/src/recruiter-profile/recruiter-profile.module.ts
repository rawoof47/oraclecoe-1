import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterProfileController } from './recruiter-profile.controller';
import { RecruiterProfileService } from './recruiter-profile.service';
import { RecruiterProfile } from './entity/recruiter-profile.entity';
import { Status } from '../statuses/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecruiterProfile, Status]),
  ],
  controllers: [RecruiterProfileController],
  providers: [RecruiterProfileService],
  exports: [RecruiterProfileService],
})
export class RecruiterProfileModule {}
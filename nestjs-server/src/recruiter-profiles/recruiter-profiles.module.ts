import { Module } from '@nestjs/common';
import { RecruiterProfilesController } from './recruiter-profiles.controller';
import { RecruiterProfilesService } from './recruiter-profiles.service';

@Module({
  controllers: [RecruiterProfilesController],
  providers: [RecruiterProfilesService]
})
export class RecruiterProfilesModule {}

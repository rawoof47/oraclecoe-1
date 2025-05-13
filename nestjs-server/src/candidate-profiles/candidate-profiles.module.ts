import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CandidateProfilesController } from './candidate-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateProfile])],  // Register CandidateProfile entity
  providers: [CandidateProfilesService],
  controllers: [CandidateProfilesController],
})
export class CandidateProfilesModule {}

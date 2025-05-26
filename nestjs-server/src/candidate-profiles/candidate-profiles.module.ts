import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CandidateProfilesController } from './candidate-profiles.controller';
import { StatusesModule } from 'src/statuses/statuses.module'; // Adjust path if needed

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateProfile]), // Register CandidateProfile entity
    StatusesModule, // Import StatusesModule to get StatusRepository
  ],
  providers: [CandidateProfilesService],
  controllers: [CandidateProfilesController],
})
export class CandidateProfilesModule {}

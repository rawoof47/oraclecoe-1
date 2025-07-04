import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CandidateProfilesController } from './candidate-profiles.controller';
import { StatusesModule } from 'src/statuses/statuses.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateProfile]),
    StatusesModule,
    AuthModule,
  ],
  providers: [CandidateProfilesService],
  controllers: [CandidateProfilesController],
  exports: [CandidateProfilesService], // ✅ Add this line to expose the service
})
export class CandidateProfilesModule {}

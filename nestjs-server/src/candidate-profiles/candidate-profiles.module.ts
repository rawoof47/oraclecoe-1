import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CandidateProfilesController } from './candidate-profiles.controller';
import { StatusesModule } from 'src/statuses/statuses.module';
import { AuthModule } from 'src/auth/auth.module'; // ✅ Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateProfile]),
    StatusesModule,
    AuthModule, // ✅ REQUIRED to use JwtAuthGuard in this module
  ],
  providers: [CandidateProfilesService],
  controllers: [CandidateProfilesController],
})
export class CandidateProfilesModule {}

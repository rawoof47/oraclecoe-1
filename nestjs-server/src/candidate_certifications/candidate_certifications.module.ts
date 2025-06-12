import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateCertificationsService } from './candidate_certifications.service';
import { CandidateCertificationsController } from './candidate_certifications.controller';
import { CandidateCertification } from './entities/certification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateCertification]) // 👈 This is critical
  ],
  controllers: [CandidateCertificationsController],
  providers: [CandidateCertificationsService],
  exports: [CandidateCertificationsService] // Export if used outside
})
export class CandidateCertificationsModule {}

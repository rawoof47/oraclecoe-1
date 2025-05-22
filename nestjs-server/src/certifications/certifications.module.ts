import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationsService } from './certifications.service';
import { CertificationsController } from './certifications.controller';
import { Certification } from './entities/certification.entity';
import { JobPostCertification } from '../job-post-certification/entities/job-post-certification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certification, JobPostCertification])],
  controllers: [CertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule {}

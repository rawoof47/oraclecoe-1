// job-post-certifications/job-post-certifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostCertification } from './entities/job-post-certification.entity';
import { JobPostCertificationsService } from './job-post-certifications.service';
import { JobPostCertificationsController } from './job-post-certifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobPostCertification])],
  controllers: [JobPostCertificationsController],
  providers: [JobPostCertificationsService],
  exports: [JobPostCertificationsService], // ✅ Export the service here
})
export class JobPostCertificationsModule {}

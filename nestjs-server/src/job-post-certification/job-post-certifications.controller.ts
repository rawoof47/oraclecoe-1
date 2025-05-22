// job-post-certifications/job-post-certifications.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { JobPostCertificationsService } from './job-post-certifications.service';
import { CreateJobPostCertificationDto } from './dto/create-job-post-certification.dto';

@Controller('job-post-certifications')
export class JobPostCertificationsController {
  constructor(private readonly service: JobPostCertificationsService) {}

 @Post()
async saveCertifications(@Body() dto: { job_post_id: string; certification_ids: string[] }) {
  const { job_post_id, certification_ids } = dto;
  return this.service.saveCertifications(job_post_id, certification_ids);
}

}
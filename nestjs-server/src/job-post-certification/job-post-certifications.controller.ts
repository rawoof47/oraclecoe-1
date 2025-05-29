import { Controller, Post, Body, Get } from '@nestjs/common';
import { JobPostCertificationsService } from './job-post-certifications.service';

@Controller('job-post-certifications')
export class JobPostCertificationsController {
  constructor(private readonly service: JobPostCertificationsService) {}

  // Existing POST endpoint — DO NOT MODIFY
  @Post()
  async saveCertifications(
    @Body() dto: { job_post_id: string; certification_ids: string[] }
  ) {
    const { job_post_id, certification_ids } = dto;
    return this.service.saveCertifications(job_post_id, certification_ids);
  }

  // ✅ GET /job-post-certifications
  @Get()
  async getAllMappings() {
    const mappings = await this.service.findAllMappings();
    return {
      message: 'All job-post certification mappings fetched successfully.',
      data: mappings,
    };
  }

  // ✅ NEW: GET /job-post-certifications/mappings (for filtering)
  @Get('mappings')
  async findAllMappings() {
    return this.service.findAllMappings();
  }
}

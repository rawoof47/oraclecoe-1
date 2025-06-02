import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { JobPostCertificationsService } from './job-post-certifications.service';

@Controller('job-post-certifications')
export class JobPostCertificationsController {
  constructor(private readonly service: JobPostCertificationsService) {}

  /**
   * ✅ Save certifications for a job post
   * POST /job-post-certifications
   */
  @Post()
  async saveCertifications(
    @Body() dto: { job_post_id: string; certification_ids: string[] }
  ) {
    const { job_post_id, certification_ids } = dto;
    const result = await this.service.saveCertifications(job_post_id, certification_ids);
    return {
      message: 'Certifications saved successfully.',
      data: result,
    };
  }

  /**
   * ✅ Get all mappings (flat job_post_id & certification_id pairs)
   * GET /job-post-certifications
   */
  @Get()
  async getAllMappings() {
    const mappings = await this.service.findAllMappings();
    return {
      message: 'All job-post certification mappings fetched successfully.',
      data: mappings,
    };
  }

  /**
   * ✅ Alias route for mappings (same as above)
   * GET /job-post-certifications/mappings
   */
  @Get('mappings')
  async findAllMappings() {
    return this.getAllMappings();
  }

  /**
   * ✅ Get certifications by job post ID
   * GET /job-post-certifications/:jobPostId
   */
  @Get(':jobPostId')
  async getCertsByJob(@Param('jobPostId') jobPostId: string) {
    const certs = await this.service.getCertsByJob(jobPostId);

    if (!certs || certs.length === 0) {
      throw new NotFoundException('No certifications found for the given job post.');
    }

    return {
      message: 'Certifications fetched successfully.',
      data: certs,
    };
  }
}

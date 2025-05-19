import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobPost } from '../job-posts/entities/job-post.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * GET /jobs
   * Fetch all job posts
   */
  @Get()
  async findAll(): Promise<JobPost[]> {
    return this.jobsService.findAll();
  }

  /**
   * GET /jobs/:id
   * Fetch a specific job post by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobPost> {
    return this.jobsService.findOne(id);
  }
}

import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobPost } from '../job-posts/entities/job-post.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Get all job posts
   */
  @Get()
  async findAll(): Promise<JobPost[]> {
    return await this.jobsService.findAll();
  }

  /**
   * Get a job post by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobPost> {
    const job = await this.jobsService.findOne(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }
}

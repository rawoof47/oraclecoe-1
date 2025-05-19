// src/jobs/jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from '../job-posts/entities/job-post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  async findAll(): Promise<JobPost[]> {
    return this.jobPostRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<JobPost> {
    const job = await this.jobPostRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException(`Job post with ID ${id} not found`);
    }
    return job;
  }
}

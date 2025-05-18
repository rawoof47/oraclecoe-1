// src/jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
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
    return await this.jobPostRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<JobPost | null> {
    return await this.jobPostRepository.findOneBy({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobShortlist } from './entities/job-shortlist.entity';
import { CreateJobShortlistDto } from './dto/create-job-shortlist.dto';
import { UpdateJobShortlistDto } from './dto/update-job-shortlist.dto';

@Injectable()
export class JobShortlistsService {
  constructor(
    @InjectRepository(JobShortlist)
    private readonly jobShortlistRepository: Repository<JobShortlist>,
  ) {}

  // Create a new job shortlist
  create(createJobShortlistDto: CreateJobShortlistDto) {
    const jobShortlist = this.jobShortlistRepository.create(createJobShortlistDto);
    return this.jobShortlistRepository.save(jobShortlist);
  }

  // Get all job shortlists
  findAll() {
    return this.jobShortlistRepository.find();
  }

  // Get job shortlist by ID
  findOne(id: string) {
    return this.jobShortlistRepository.findOne({ where: { id } });
  }

  // Update job shortlist by ID
  update(id: string, updateJobShortlistDto: UpdateJobShortlistDto) {
    return this.jobShortlistRepository.update(id, updateJobShortlistDto);
  }

  // Remove a job shortlist by ID
  remove(id: string) {
    return this.jobShortlistRepository.delete(id);
  }
}

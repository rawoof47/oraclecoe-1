import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto'; // Import DTO for update
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class JobPostsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  // Create a new job post
  async create(createJobPostDto: CreateJobPostDto) {
    const jobPost = new JobPost();

    // Directly assign values, checking for undefined and replacing with null if needed
    jobPost.recruiter_id = createJobPostDto.recruiterId;
    jobPost.job_title = createJobPostDto.jobTitle;
    jobPost.location = createJobPostDto.location ?? null;
    jobPost.modules_required = createJobPostDto.modulesRequired ?? null;
    jobPost.skills_required = createJobPostDto.skillsRequired ?? null;
    jobPost.certifications_required = createJobPostDto.certificationsRequired ?? null;
    jobPost.experience_min = createJobPostDto.experienceMin ?? null;
    jobPost.experience_max = createJobPostDto.experienceMax ?? null;
    jobPost.employment_type = createJobPostDto.employmentType ?? null;
    jobPost.compensation_range = createJobPostDto.compensationRange ?? null;
    jobPost.job_description = createJobPostDto.jobDescription ?? null;
    jobPost.notice_period = createJobPostDto.noticePeriod ?? null;
    jobPost.status_id = createJobPostDto.statusId;
    jobPost.application_deadline = createJobPostDto.applicationDeadline ?? null;
    jobPost.created_by = createJobPostDto.createdBy ?? null;
    jobPost.updated_by = createJobPostDto.updatedBy ?? null;

    // Validate before saving
    if (!jobPost.job_title || !jobPost.skills_required || !jobPost.job_description) {
      throw new BadRequestException('Job Title, Skills Required, and Job Description are required.');
    }

    return this.jobPostRepository.save(jobPost);
  }

  // Get all job posts
  findAll() {
    return this.jobPostRepository.find();
  }

  // Get a job post by ID
  findOne(id: string) {
    return this.jobPostRepository.findOne({ where: { id } });
  }

  // Update an existing job post by ID
  async update(id: string, updateJobPostDto: UpdateJobPostDto) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new Error('Job post not found');
    }

    // Update fields based on DTO
    Object.assign(jobPost, updateJobPostDto);

    // Validate required fields
    if (!jobPost.job_title || !jobPost.skills_required || !jobPost.job_description) {
      throw new BadRequestException('Job Title, Skills Required, and Job Description are required.');
    }

    return this.jobPostRepository.save(jobPost);
  }

  // Remove a job post by ID
  async remove(id: string) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new Error('Job post not found');
    }

    return this.jobPostRepository.remove(jobPost);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Injectable()
export class JobPostsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  // Create a new job post
  async create(createJobPostDto: CreateJobPostDto) {
    const jobPost = new JobPost();

    // Manually map the fields from the DTO to the entity
    jobPost.recruiter_id = createJobPostDto.recruiterId;
    jobPost.job_title = createJobPostDto.jobTitle;
    jobPost.location = createJobPostDto.location;
    jobPost.modules_required = createJobPostDto.modulesRequired;
    jobPost.skills_required = createJobPostDto.skillsRequired;
    jobPost.certifications_required = createJobPostDto.certificationsRequired;
    jobPost.experience_min = createJobPostDto.experienceMin;
    jobPost.experience_max = createJobPostDto.experienceMax;
    jobPost.employment_type = createJobPostDto.employmentType;
    jobPost.compensation_range = createJobPostDto.compensationRange;
    jobPost.job_description = createJobPostDto.jobDescription;
    jobPost.notice_period = createJobPostDto.noticePeriod;
    jobPost.status_id = createJobPostDto.statusId;
    jobPost.application_deadline = createJobPostDto.applicationDeadline;
    jobPost.created_by = createJobPostDto.createdBy;
    jobPost.updated_by = createJobPostDto.updatedBy;

    // Save the job post in the repository
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
}

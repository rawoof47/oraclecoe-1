import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JobPostSkillService } from 'src/job-post-skill/job-post-skill.service';

@Injectable()
export class JobPostsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly jobPostSkillService: JobPostSkillService,
  ) {}

  // ✅ Create a new job post and related skills
  async create(createJobPostDto: CreateJobPostDto) {
    const jobPost = new JobPost();

    jobPost.recruiter_id = createJobPostDto.recruiterId;
    jobPost.job_title = createJobPostDto.jobTitle;
    jobPost.location = createJobPostDto.location ?? null;
    jobPost.certifications_required = createJobPostDto.certificationsRequired ?? null;
    jobPost.experience_min = createJobPostDto.experienceMin ?? null;
    jobPost.experience_max = createJobPostDto.experienceMax ?? null;
    jobPost.employment_type = createJobPostDto.employmentType ?? null;
    jobPost.compensation_range = createJobPostDto.compensationRange ?? null;
    jobPost.job_description = createJobPostDto.jobDescription ?? null;
    jobPost.notice_period = createJobPostDto.noticePeriod ?? null;
    jobPost.status_id = '36f3301d-318e-11f0-aa4d-80ce6232908a'; // Default status
    jobPost.application_deadline = createJobPostDto.applicationDeadline ?? null;
    jobPost.created_by = createJobPostDto.createdBy ?? null;
    jobPost.updated_by = createJobPostDto.updatedBy ?? null;

    jobPost.work_mode = Array.isArray(createJobPostDto.workMode)
      ? createJobPostDto.workMode.join(',')
      : null;

    // ✅ New fields
    jobPost.role_summary = createJobPostDto.roleSummary ?? null;
    jobPost.preferred_qualifications = createJobPostDto.preferredQualifications ?? null;
    jobPost.what_we_offer = createJobPostDto.whatWeOffer ?? null;
    jobPost.how_to_apply = createJobPostDto.howToApply ?? null;

    if (!jobPost.job_title || !jobPost.job_description) {
      throw new BadRequestException(
        'Job Title and Job Description are required.',
      );
    }

    const savedPost = await this.jobPostRepository.save(jobPost);

    if (
      createJobPostDto.skillIds &&
      Array.isArray(createJobPostDto.skillIds) &&
      createJobPostDto.skillIds.length > 0
    ) {
      await this.jobPostSkillService.saveSkills(savedPost.id, createJobPostDto.skillIds);
    }

    return {
      message: 'Job post created successfully',
      data: savedPost,
    };
  }

  // ✅ Get all job posts
  async findAll() {
    const jobPosts = await this.jobPostRepository.find();
    return {
      message: 'Job posts fetched successfully',
      data: jobPosts,
    };
  }

  // ✅ Get a job post by ID
  async findOne(id: string) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return {
      message: 'Job post fetched successfully',
      data: jobPost,
    };
  }

  // ✅ Update a job post and its skills
  async update(id: string, updateJobPostDto: UpdateJobPostDto) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    Object.assign(jobPost, updateJobPostDto);

    // Convert arrays to comma-separated strings if provided
    if (Array.isArray(updateJobPostDto.workMode)) {
      jobPost.work_mode = updateJobPostDto.workMode.join(',');
    }

    if (!jobPost.job_title || !jobPost.job_description) {
      throw new BadRequestException(
        'Job Title and Job Description are required.',
      );
    }

    const updatedPost = await this.jobPostRepository.save(jobPost);

    if (
      updateJobPostDto.skillIds &&
      Array.isArray(updateJobPostDto.skillIds)
    ) {
      await this.jobPostSkillService.replaceSkills(updatedPost.id, updateJobPostDto.skillIds);
    }

    return {
      message: 'Job post updated successfully',
      data: updatedPost,
    };
  }

  // ✅ Remove a job post by ID
  async remove(id: string) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    const deleted = await this.jobPostRepository.remove(jobPost);

    return {
      message: 'Job post deleted successfully',
      data: deleted,
    };
  }
}

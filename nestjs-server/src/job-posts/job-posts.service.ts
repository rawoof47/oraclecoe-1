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
import { JobPostCertificationsService } from 'src/job-post-certification/job-post-certifications.service';

@Injectable()
export class JobPostsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly jobPostSkillService: JobPostSkillService,
    private readonly jobPostCertificationsService: JobPostCertificationsService,
  ) {}

  // ✅ Create a new job post and related skills & certifications
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
    jobPost.work_mode = createJobPostDto.workMode ?? null;

    // ✅ New fields
    jobPost.role_summary = createJobPostDto.roleSummary ?? null;
    jobPost.preferred_qualifications = createJobPostDto.preferredQualifications ?? null;
    jobPost.what_we_offer = createJobPostDto.whatWeOffer ?? null;
    jobPost.how_to_apply = createJobPostDto.howToApply ?? null;

    // Check required fields first
    if (!jobPost.job_title || !jobPost.job_description) {
      throw new BadRequestException('Job Title and Job Description are required.');
    }

    let savedPost: JobPost | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS && !savedPost) {
      attempts++;
      try {
        // Get current max job_number
        const maxResult = await this.jobPostRepository
          .createQueryBuilder('job_post')
          .select('MAX(job_post.job_number)', 'max')
          .getRawOne();

        const currentMax = maxResult?.max || 0;
        const nextJobNumber = currentMax + 1;

        // Assign calculated job number
        jobPost.job_number = nextJobNumber;

        // Attempt to save
        savedPost = await this.jobPostRepository.save(jobPost);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' && attempts < MAX_ATTEMPTS) {
          // Duplicate entry - wait and retry
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          throw error; // Rethrow other errors
        }
      }
    }

    // Throw if we couldn't save after all attempts
    if (!savedPost) {
      throw new Error('Failed to create job post after 3 attempts');
    }

    // Handle skills and certifications
    if (
      createJobPostDto.skillIds &&
      Array.isArray(createJobPostDto.skillIds) &&
      createJobPostDto.skillIds.length > 0
    ) {
      await this.jobPostSkillService.saveSkills(savedPost.id, createJobPostDto.skillIds);
    }

    if (
      createJobPostDto.certificationIds &&
      Array.isArray(createJobPostDto.certificationIds) &&
      createJobPostDto.certificationIds.length > 0
    ) {
      await this.jobPostCertificationsService.saveCertifications(
        savedPost.id,
        createJobPostDto.certificationIds,
      );
    }

    return {
      message: 'Job post created successfully',
      data: savedPost,
    };
  }
  
  

  // ✅ Get all job posts (with skill_ids and certification_ids)
  async findAll() {
    const jobPosts = await this.jobPostRepository.find();

    const jobsWithRelations = await Promise.all(
      jobPosts.map(async (job) => ({
        ...job,
        skill_ids: await this.getSkillIdsForJob(job.id),
        certification_ids: await this.getCertificationIdsForJob(job.id),
      })),
    );

    return {
      message: 'Job posts fetched successfully',
      data: jobsWithRelations,
    };
  }

  // ✅ Get a job post by ID (with skill_ids and certification_ids)
  async findOne(id: string) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return {
      message: 'Job post fetched successfully',
      data: {
        ...jobPost,
        skill_ids: await this.getSkillIdsForJob(id),
        certification_ids: await this.getCertificationIdsForJob(id),
      },
    };
  }

  // ✅ Update a job post and its skills & certifications
  async update(id: string, updateJobPostDto: UpdateJobPostDto) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    const existingJobNumber = jobPost.job_number;

    Object.assign(jobPost, updateJobPostDto);

    jobPost.job_number = existingJobNumber;

    if (updateJobPostDto.workMode) {
      jobPost.work_mode = updateJobPostDto.workMode;
    }

    if (!jobPost.job_title || !jobPost.job_description) {
      throw new BadRequestException('Job Title and Job Description are required.');
    }

    const updatedPost = await this.jobPostRepository.save(jobPost);

    if (
      updateJobPostDto.skillIds &&
      Array.isArray(updateJobPostDto.skillIds)
    ) {
      await this.jobPostSkillService.replaceSkills(updatedPost.id, updateJobPostDto.skillIds);
    }

    if (
      updateJobPostDto.certificationIds &&
      Array.isArray(updateJobPostDto.certificationIds)
    ) {
      await this.jobPostCertificationsService.replaceCertifications(
        updatedPost.id,
        updateJobPostDto.certificationIds,
      );
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

  // 🔁 Helper method to get skill IDs for a job post
  private async getSkillIdsForJob(jobId: string): Promise<string[]> {
    const skills = await this.jobPostSkillService.getSkillsByJob(jobId);
    return skills.map((skill) => skill.skill_id);
  }

  // 🔁 Helper method to get certification IDs for a job post
  private async getCertificationIdsForJob(jobId: string): Promise<string[]> {
    const certs = await this.jobPostCertificationsService.getByJobPostId(jobId);
    return certs.map((cert) => cert.certification_id);
  }
  // Add this method to JobPostsService class
async findByRecruiter(recruiterId: string) {
  const jobPosts = await this.jobPostRepository.find({ 
    where: { recruiter_id: recruiterId } 
  });

  const jobsWithRelations = await Promise.all(
    jobPosts.map(async (job) => ({
      ...job,
      skill_ids: await this.getSkillIdsForJob(job.id),
      certification_ids: await this.getCertificationIdsForJob(job.id),
    })),
  );

  return jobsWithRelations;
}

// ✅ Add method to update job status
  async updateStatus(id: string, statusId: string) {
    const jobPost = await this.jobPostRepository.findOne({ where: { id } });
    
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    
    jobPost.status_id = statusId;
    const updatedPost = await this.jobPostRepository.save(jobPost);
    
    return {
      message: 'Job status updated successfully',
      data: updatedPost,
    };
  }
// Add this method to JobPostsService class
async findActiveJobs() {
  const activeStatusId = '36f3301d-318e-11f0-aa4d-80ce6232908a';
  const jobPosts = await this.jobPostRepository.find({ 
    where: { status_id: activeStatusId } 
  });

  const jobsWithRelations = await Promise.all(
    jobPosts.map(async (job) => ({
      ...job,
      skill_ids: await this.getSkillIdsForJob(job.id),
      certification_ids: await this.getCertificationIdsForJob(job.id),
    })),
  );

  return jobsWithRelations;
}


async findByJobNumber(jobNumber: number) {
  const jobPost = await this.jobPostRepository.findOne({ 
    where: { job_number: jobNumber } 
  });
  
  if (!jobPost) return null;

  return {
    ...jobPost,
    skill_ids: await this.getSkillIdsForJob(jobPost.id),
    certification_ids: await this.getCertificationIdsForJob(jobPost.id),
  };
}
}

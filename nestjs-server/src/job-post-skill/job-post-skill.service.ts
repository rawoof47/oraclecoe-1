import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPostSkill } from './entities/job-post-skill.entity';
import { SaveJobPostSkillsDto } from './dto';
import { JobPostsService } from '../job-posts/job-posts.service';

@Injectable()
export class JobPostSkillService {
  constructor(
    @InjectRepository(JobPostSkill)
    private readonly jobPostSkillRepo: Repository<JobPostSkill>,

    @Inject(forwardRef(() => JobPostsService))
    private readonly jobPostsService: JobPostsService,
  ) {}

  // ✅ Save multiple skills for a job post (used in CREATE)
  async saveSkills(jobPostId: string, skillIds: string[]) {
    if (!jobPostId) {
      throw new BadRequestException('jobPostId is required.');
    }

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      throw new BadRequestException(
        'skillIds array is required and cannot be empty.',
      );
    }

    const entities = skillIds.map((skillId) =>
      this.jobPostSkillRepo.create({
        job_post_id: jobPostId,
        skill_id: skillId,
      }),
    );

    return this.jobPostSkillRepo.save(entities);
  }

  // ✅ Replace skills for a job post (used in UPDATE)
  async replaceSkills(jobPostId: string, skillIds: string[]) {
    if (!jobPostId) {
      throw new BadRequestException('jobPostId is required.');
    }

    if (!Array.isArray(skillIds)) {
      throw new BadRequestException('skillIds must be an array.');
    }

    await this.jobPostSkillRepo.delete({ job_post_id: jobPostId });

    if (skillIds.length === 0) {
      return [];
    }

    const newSkills = skillIds.map((skillId) =>
      this.jobPostSkillRepo.create({
        job_post_id: jobPostId,
        skill_id: skillId,
      }),
    );

    return this.jobPostSkillRepo.save(newSkills);
  }

  // ✅ Get all full skill entities linked to a specific job post (original)
  async getAllSkillsByJob(jobPostId: string) {
    if (!jobPostId) {
      throw new BadRequestException('jobPostId is required.');
    }

    return this.jobPostSkillRepo.find({
      where: { job_post_id: jobPostId },
    });
  }

  // ✅ Get only skill IDs linked to a specific job post
  async getSkillsByJob(jobPostId: string): Promise<JobPostSkill[]> {
    if (!jobPostId) {
      throw new BadRequestException('jobPostId is required.');
    }

    return this.jobPostSkillRepo.find({
      where: { job_post_id: jobPostId },
      select: ['skill_id'],
    });
  }

  // ✅ Fetch all mappings for filtering use (corrected select syntax)
  async findAllMappings() {
    return this.jobPostSkillRepo.find({
      select: {
        job_post_id: true,
        skill_id: true,
      },
    });
  }
}

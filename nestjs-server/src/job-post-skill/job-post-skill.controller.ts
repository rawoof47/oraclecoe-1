import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JobPostSkillService } from './job-post-skill.service';

@Controller('job-post-skills')
export class JobPostSkillController {
  constructor(private readonly jobPostSkillService: JobPostSkillService) {}

  // POST /job-post-skills
  @Post()
  async assignSkills(
    @Body()
    payload: {
      jobPostId: string;
      skillIds: string[];
    },
  ) {
    const { jobPostId, skillIds } = payload;

    if (!jobPostId || !Array.isArray(skillIds)) {
      throw new BadRequestException('Invalid payload. jobPostId and skillIds are required.');
    }

    const result = await this.jobPostSkillService.saveSkills(jobPostId, skillIds);

    return {
      message: 'Skills assigned to job post successfully.',
      data: result,
    };
  }

  // GET /job-post-skills/:jobPostId
  @Get(':jobPostId')
  async getSkills(@Param('jobPostId') jobPostId: string) {
    const skills = await this.jobPostSkillService.getSkillsByJob(jobPostId);

    if (!skills || skills.length === 0) {
      throw new NotFoundException('No skills found for the given job post.');
    }

    return {
      message: 'Skills fetched successfully.',
      data: skills,
    };
  }

  // ✅ NEW: GET /job-post-skills/mappings (for filtering)
  @Get('mappings')
  async findAllMappings() {
    return this.jobPostSkillService.findAllMappings();
  }
}

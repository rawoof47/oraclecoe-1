import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { JobPostsService } from './job-posts.service';
import { JobPostSkillService } from '../job-post-skill/job-post-skill.service';
import { JobPostCertificationsService } from '../job-post-certification/job-post-certifications.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Controller('job-posts')
export class JobPostsController {
  constructor(
    private readonly jobPostsService: JobPostsService,
    private readonly jobPostSkillService: JobPostSkillService,
    private readonly jobPostCertificationService: JobPostCertificationsService,
  ) {}

  @Post()
  async create(@Body() createJobPostDto: CreateJobPostDto) {
    const {
      skillIds = [],
      certificationIds = [],
      ...jobPostData
    } = createJobPostDto;

    // Create job post and wrap in message
    const jobPostResponse = await this.jobPostsService.create(jobPostData);

    const jobPostId = jobPostResponse.data.id;

    // ✅ Save skills if provided
    if (skillIds.length > 0) {
      await this.jobPostSkillService.saveSkills(jobPostId, skillIds);
    }

    // ✅ Save certifications if provided
    if (certificationIds.length > 0) {
      await this.jobPostCertificationService.saveCertifications(jobPostId, certificationIds);
    }

    return jobPostResponse;
  }

  @Get()
  async findAll() {
    const jobPosts = await this.jobPostsService.findAll();
    return { message: 'Job posts fetched successfully', data: jobPosts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const jobPost = await this.jobPostsService.findOne(id);
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    return { message: 'Job post fetched successfully', data: jobPost };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ) {
    const {
      skillIds = null,
      certificationIds = null,
      ...updateData
    } = updateJobPostDto;

    const updatedJobPost = await this.jobPostsService.update(id, updateData);

    // ✅ Replace skills only if explicitly provided
    if (skillIds !== null) {
      await this.jobPostSkillService.replaceSkills(id, skillIds);
    }

    // ✅ Replace certifications only if explicitly provided
    if (certificationIds !== null) {
      await this.jobPostCertificationService.replaceCertifications(id, certificationIds);
    }

    return { message: 'Job post updated successfully', data: updatedJobPost };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const jobPost = await this.jobPostsService.remove(id);
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
    return { message: 'Job post removed successfully', data: jobPost };
  }
  @Get('by-recruiter/:recruiterId')
async findByRecruiter(@Param('recruiterId') recruiterId: string) {
  const jobPosts = await this.jobPostsService.findByRecruiter(recruiterId);
  return { 
    message: 'Job posts fetched successfully', 
    data: jobPosts 
  };
}

// ✅ Add status update endpoint
  @Put('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { statusId: string }
  ) {
    const updatedJobPost = await this.jobPostsService.updateStatus(id, body.statusId);
    return {
      message: 'Job status updated successfully',
      data: updatedJobPost,
    };
  }

  @Get('active/list')
async findActiveJobs() {
  const jobPosts = await this.jobPostsService.findActiveJobs();
  return { 
    message: 'Active job posts fetched successfully', 
    data: jobPosts 
  };
}

@Get('by-job-number/:jobNumber')
async findByJobNumber(@Param('jobNumber') jobNumber: number) {
  const jobPost = await this.jobPostsService.findByJobNumber(jobNumber);
  if (!jobPost) {
    throw new NotFoundException('Job post not found');
  }
  return {
    message: 'Job post fetched successfully',
    data: jobPost,
  };
}
}

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
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Controller('job-posts')
export class JobPostsController {
  constructor(
    private readonly jobPostsService: JobPostsService,
    private readonly jobPostSkillService: JobPostSkillService,
  ) {}

  @Post()
  async create(@Body() createJobPostDto: CreateJobPostDto) {
    const { skillIds = [], ...jobPostData } = createJobPostDto;

    // Create job post and wrap in message
    const jobPostResponse = await this.jobPostsService.create(jobPostData);

    // ✅ Save skills if provided
    if (skillIds.length > 0) {
      await this.jobPostSkillService.saveSkills(jobPostResponse.data.id, skillIds);
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
    const { skillIds = null, ...updateData } = updateJobPostDto;

    const updatedJobPost = await this.jobPostsService.update(id, updateData);

    // ✅ Replace skills only if explicitly provided
    if (skillIds !== null) {
      await this.jobPostSkillService.replaceSkills(id, skillIds);
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
}

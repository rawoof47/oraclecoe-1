import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProfile } from 'src/candidate-profiles/entities/candidate-profile.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,

    @InjectRepository(CandidateProfile)
    private readonly candidateProfileRepository: Repository<CandidateProfile>,
  ) {}

  // ✅ Standard: Create a new application using full DTO
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.create(createApplicationDto);
  }

  // ✅ New: Create application using user_id (automatically map to candidate_id)
  @Post('by-user')
  @HttpCode(HttpStatus.CREATED)
  async createByUser(
    @Body() payload: { user_id: string; job_id: string },
  ): Promise<Application> {
    // 🔍 Fetch candidate_id using user_id
    const candidate = await this.candidateProfileRepository.findOne({
      where: { user_id: payload.user_id },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate profile not found for the user');
    }

    const dto: CreateApplicationDto = {
      candidate_id: candidate.id,
      job_id: payload.job_id,
      application_status_id: '12c7f28f-3a21-11f0-8520-ac1f6bbcd360', // ✅ Default status
      withdrawn: false,
      created_by: payload.user_id,
      updated_by: payload.user_id,
    };

    return this.applicationsService.create(dto);
  }

  // ✅ Get all applications
  @Get()
  async findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  // ✅ Get one application by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  // ✅ Find application by candidate_id and job_id
  @Post('find-by-user-and-job')
  @HttpCode(HttpStatus.OK)
  async findByCandidateAndJob(
    @Body() body: { candidate_id: string; job_id: string },
  ): Promise<Application | null> {
    return this.applicationsService.findByCandidateAndJob(
      body.candidate_id,
      body.job_id,
    );
  }

  // ✅ Update application
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  // ✅ Delete application
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.applicationsService.remove(id);
  }
}

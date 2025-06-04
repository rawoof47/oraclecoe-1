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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.create(createApplicationDto);
  }

  @Post('by-user')
  @HttpCode(HttpStatus.CREATED)
  async createByUser(
    @Body() payload: { user_id: string; job_id: string },
  ): Promise<Application> {
    const candidate = await this.candidateProfileRepository.findOne({
      where: { user_id: payload.user_id },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate profile not found for the user');
    }

    const dto: CreateApplicationDto = {
      candidate_id: candidate.id,
      job_id: payload.job_id,
      application_status_id: '12c7f28f-3a21-11f0-8520-ac1f6bbcd360',
      withdrawn: false,
      created_by: payload.user_id,
      updated_by: payload.user_id,
    };

    return this.applicationsService.create(dto);
  }

  @Post('check-by-user-and-job') // ✅ NEW ENDPOINT
  @HttpCode(HttpStatus.OK)
  async checkByUserAndJob(
    @Body() payload: { user_id: string; job_id: string },
  ): Promise<{ applied: boolean }> {
    const candidate = await this.candidateProfileRepository.findOne({
      where: { user_id: payload.user_id },
    });

    if (!candidate) {
      return { applied: false };
    }

    const application = await this.applicationsService.findByCandidateAndJob(
      candidate.id,
      payload.job_id,
    );

    return { applied: !!application && !application.withdrawn };
  }

  @Get()
  async findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

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

  @Get('user/:candidateId')
  @HttpCode(HttpStatus.OK)
  async getAppliedJobsByCandidate(
    @Param('candidateId') candidateId: string,
  ): Promise<string[]> {
    return this.applicationsService.getAppliedJobIdsByCandidate(candidateId);
  }

  @Get('by-user/:userId')
  @HttpCode(HttpStatus.OK)
  async getAppliedJobsByUser(
    @Param('userId') userId: string,
  ): Promise<string[]> {
    return this.applicationsService.getAppliedJobIdsByUser(userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.applicationsService.remove(id);
  }

  // ✅ NEW — Withdraw endpoint
  @Put('withdraw/:id')
  @HttpCode(HttpStatus.OK)
  async withdraw(
    @Param('id') id: string,
    @Body() body: { user_id: string },
  ): Promise<Application> {
    return this.applicationsService.withdraw(id, body.user_id);
  }
  // ✅ Add this NEW endpoint to return full applications
@Get('by-user-full/:userId')
@HttpCode(HttpStatus.OK)
async getApplicationsByUserFull(
  @Param('userId') userId: string,
): Promise<Application[]> {
  return this.applicationsService.findByUser(userId);
}
}

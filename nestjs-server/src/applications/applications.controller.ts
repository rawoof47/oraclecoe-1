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

    return this.applicationsService.createFromUser({
      user_id: payload.user_id,
      job_id: payload.job_id,
    });
  }

  @Post('check-by-user-and-job')
  @HttpCode(HttpStatus.OK)
  async checkByUserAndJob(
    @Body() payload: { user_id: string; job_id: string; include_withdrawn?: boolean },
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

    return {
      applied: !!application &&
        (payload.include_withdrawn ? true : !application.withdrawn),
    };
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

  @Put('withdraw/:id')
  @HttpCode(HttpStatus.OK)
  async withdraw(
    @Param('id') id: string,
    @Body() body: { user_id: string; reason?: string },
  ): Promise<Application> {
    return this.applicationsService.withdrawWithReason(id, body.user_id, body.reason);
  }

  @Get('by-user-full/:userId')
  @HttpCode(HttpStatus.OK)
  async getApplicationsByUserFull(
    @Param('userId') userId: string,
  ): Promise<Application[]> {
    return this.applicationsService.findByUser(userId);
  }

  @Get('by-recruiter/:recruiterId')
  @HttpCode(HttpStatus.OK)
  async getApplicationsByRecruiter(
    @Param('recruiterId') recruiterId: string,
  ): Promise<Application[]> {
    return this.applicationsService.findByRecruiter(recruiterId);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<Application> {
    return this.applicationsService.updateStatus(id, body.status);
  }

  // ✅ New: Get withdrawal reason
  @Get('withdrawal-reason/:id')
  @HttpCode(HttpStatus.OK)
  async getWithdrawalReason(@Param('id') id: string): Promise<{ reason: string | null }> {
    return this.applicationsService.getWithdrawnReason(id);
  }

  // ✅ New: Reactivate withdrawn application
  @Put('reactivate/:id')
  @HttpCode(HttpStatus.OK)
  async reactivateApplication(
    @Param('id') id: string,
    @Body() body: { user_id: string },
  ): Promise<Application> {
    return this.applicationsService.reactivate(id, body.user_id);
  }

  // applications.controller.ts
@Post('count-by-jobs')
@HttpCode(HttpStatus.OK)
async getCountByJobs(
  @Body() body: { jobIds: string[] }
): Promise<Record<string, number>> {
  return this.applicationsService.getCountByJobs(body.jobIds);
}
}

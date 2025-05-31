import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CandidateProfile } from 'src/candidate-profiles/entities/candidate-profile.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(CandidateProfile)
    private readonly candidateProfilesRepository: Repository<CandidateProfile>,
  ) {}

  // ✅ Create a new application using candidate_id directly
  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationRepository.create({
      candidate_id: createApplicationDto.candidate_id,
      job_id: createApplicationDto.job_id,
      application_status_id: createApplicationDto.application_status_id ?? null,
      withdrawn: createApplicationDto.withdrawn ?? false,
      created_by: createApplicationDto.created_by ?? null,
      updated_by: createApplicationDto.updated_by ?? null,
    });

    return this.applicationRepository.save(application);
  }

  // ✅ Create application using user_id (resolves candidate_id internally)
  async createFromUser(payload: { user_id: string; job_id: string }): Promise<Application> {
    const candidateProfile = await this.candidateProfilesRepository.findOne({
      where: { user_id: payload.user_id },
    });

    if (!candidateProfile) {
      throw new NotFoundException(`No candidate profile found for user_id ${payload.user_id}`);
    }

    const createDto: CreateApplicationDto = {
      candidate_id: candidateProfile.id,
      job_id: payload.job_id,
      application_status_id: '12c7f28f-3a21-11f0-8520-ac1f6bbcd360', // default status
      withdrawn: false,
      created_by: payload.user_id,
      updated_by: payload.user_id,
    };

    return this.create(createDto);
  }

  // ✅ Check if user already applied (excluding withdrawn apps)
  async hasUserAppliedToJob(user_id: string, job_id: string): Promise<boolean> {
    const candidateProfile = await this.candidateProfilesRepository.findOne({
      where: { user_id },
    });

    if (!candidateProfile) return false;

    const existing = await this.applicationRepository.findOne({
      where: {
        candidate_id: candidateProfile.id,
        job_id,
        withdrawn: false,
      },
    });

    return !!existing;
  }

  // ✅ Get all applications
  findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  // ✅ Get application by ID
  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  // ✅ Get all applications by user_id (resolves candidate_id)
  async findByUser(user_id: string): Promise<Application[]> {
    const candidateProfile = await this.candidateProfilesRepository.findOne({
      where: { user_id },
    });

    if (!candidateProfile) {
      throw new NotFoundException(`No candidate profile found for user_id ${user_id}`);
    }

    return this.applicationRepository.find({
      where: { candidate_id: candidateProfile.id },
      order: { applied_on: 'DESC' },
    });
  }

  // ✅ Get application by candidate_id + job_id
  async findByCandidateAndJob(candidate_id: string, job_id: string): Promise<Application | null> {
    return this.applicationRepository.findOne({
      where: {
        candidate_id,
        job_id,
      },
    });
  }

  // ✅ Get job_ids a candidate has applied to (excluding withdrawn)
  async getAppliedJobIdsByCandidate(candidate_id: string): Promise<string[]> {
    const applications = await this.applicationRepository.find({
      where: {
        candidate_id,
        withdrawn: false,
      },
      select: ['job_id'],
    });

    return applications.map((a) => a.job_id);
  }

  // ✅ Update application
  async update(id: string, updateDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');

    application.candidate_id = updateDto.candidate_id ?? application.candidate_id;
    application.job_id = updateDto.job_id ?? application.job_id;
    application.application_status_id = updateDto.application_status_id ?? application.application_status_id;
    application.withdrawn = updateDto.withdrawn ?? application.withdrawn;
    application.updated_by = updateDto.updated_by ?? application.updated_by;

    return this.applicationRepository.save(application);
  }

  // ✅ Delete application by ID
  async remove(id: string): Promise<void> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    await this.applicationRepository.remove(application);
  }
}

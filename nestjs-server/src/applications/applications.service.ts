import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CandidateProfile } from 'src/candidate-profiles/entities/candidate-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(CandidateProfile)
    private readonly candidateProfilesRepository: Repository<CandidateProfile>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailService: MailService
  ) {}

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

  async createFromUser(payload: { user_id: string; job_id: string }): Promise<Application> {
  const candidateProfile = await this.candidateProfilesRepository.findOne({
    where: { user_id: payload.user_id },
  });

  if (!candidateProfile) {
    throw new NotFoundException(`No candidate profile found for user_id ${payload.user_id}`);
  }

  const candidate_id = candidateProfile.id;

  const existing = await this.applicationRepository.findOne({
    where: {
      candidate_id,
      job_id: payload.job_id,
      withdrawn: true,
    },
  });

  let application: Application;

  if (existing) {
    existing.withdrawn = false;
    existing.withdrawal_reason = null;
    existing.application_status_id = '12c7f28f-3a21-11f0-8520-ac1f6bbcd360';
    existing.updated_by = payload.user_id;
    existing.applied_on = new Date();

    application = await this.applicationRepository.save(existing);
  } else {
    const createDto: CreateApplicationDto = {
      candidate_id,
      job_id: payload.job_id,
      application_status_id: '12c7f28f-3a21-11f0-8520-ac1f6bbcd360',
      withdrawn: false,
      created_by: payload.user_id,
      updated_by: payload.user_id,
    };

    application = await this.create(createDto);
  }

  // ✅ Send job application confirmation email
 try {
  const user = await this.usersRepository.findOne({
    where: { id: payload.user_id },
  });

  if (!user) {
    throw new NotFoundException(`User not found for id ${payload.user_id}`);
  }

  const result = await this.applicationRepository
    .createQueryBuilder('app')
    .innerJoin('job_posts', 'job', 'job.id = app.job_id')
    .innerJoin('recruiter_profiles', 'profile', 'profile.user_id = job.recruiter_id')
    .select([
      'job.job_title AS job_title',
      'profile.company_name AS company_name',
    ])
    .where('app.id = :id', { id: application.id })
    .getRawOne();

  const jobTitle = result?.job_title || 'a job';
  const companyName = result?.company_name || 'the company';

  await this.mailService.sendJobApplicationConfirmationEmail(
    `${user.first_name} ${user.last_name}`,
    user.email,
    jobTitle,
    companyName
  );
} catch (err) {
  console.error('❌ Failed to send job application email:', err);
}
  return application;
}


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

  findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async findByUser(user_id: string): Promise<Application[]> {
    const candidateProfile = await this.candidateProfilesRepository.findOne({
      where: { user_id },
    });

    if (!candidateProfile) {
      throw new NotFoundException(`No candidate profile found for user_id ${user_id}`);
    }

    return this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.job_post', 'job_post')
      .where('application.candidate_id = :candidateId', { candidateId: candidateProfile.id })
      .orderBy('application.applied_on', 'DESC')
      .getMany();
  }

  async findByCandidateAndJob(candidate_id: string, job_id: string): Promise<Application | null> {
    return this.applicationRepository.findOne({
      where: {
        candidate_id,
        job_id,
      },
    });
  }

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

  async remove(id: string): Promise<void> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    await this.applicationRepository.remove(application);
  }

  async getAppliedJobIdsByUser(user_id: string): Promise<string[]> {
    const candidateProfile = await this.candidateProfilesRepository.findOne({
      where: { user_id },
    });

    if (!candidateProfile) return [];

    return this.getAppliedJobIdsByCandidate(candidateProfile.id);
  }

  async withdraw(id: string, user_id: string): Promise<Application> {
  const application = await this.applicationRepository.findOne({ where: { id } });
  if (!application) throw new NotFoundException('Application not found');

  application.application_status_id = '99e8ca42-4058-11f0-8520-ac1f6bbcd360';
  application.withdrawn = true;
  application.updated_by = user_id;

  const savedApplication = await this.applicationRepository.save(application);

  try {
    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    const result = await this.applicationRepository
      .createQueryBuilder('app')
      .innerJoin('job_posts', 'job', 'job.id = app.job_id')
      .innerJoin('recruiter_profiles', 'profile', 'profile.user_id = job.recruiter_id')
      .select([
        'job.job_title AS job_title',
        'profile.company_name AS company_name',
      ])
      .where('app.id = :id', { id: savedApplication.id })
      .getRawOne();

    const jobTitle = result?.job_title || 'a job';
    const companyName = result?.company_name || 'the company';

    console.log(`📤 Sending withdrawal email to ${user.email}`);
    await this.mailService.sendApplicationWithdrawalEmail(
      `${user.first_name} ${user.last_name}`,
      user.email,
      jobTitle,
      companyName
    );
  } catch (err) {
    console.error('❌ Failed to send withdrawal email:', err);
  }

  return savedApplication;
}



  async withdrawWithReason(id: string, user_id: string, reason?: string): Promise<Application> {
  console.log('⚠️ withdrawWithReason() method hit'); // Debug log

  const application = await this.applicationRepository.findOne({ where: { id } });
  if (!application) throw new NotFoundException('Application not found');

  application.application_status_id = '99e8ca42-4058-11f0-8520-ac1f6bbcd360';
  application.withdrawn = true;
  application.updated_by = user_id;

  if ('withdrawal_reason' in application && reason) {
    (application as any).withdrawal_reason = reason;
  }

  const saved = await this.applicationRepository.save(application);

  // ✅ Send withdrawal email
  try {
    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    const result = await this.applicationRepository
      .createQueryBuilder('app')
      .innerJoin('job_posts', 'job', 'job.id = app.job_id')
      .innerJoin('recruiter_profiles', 'profile', 'profile.user_id = job.recruiter_id')
      .select([
        'job.job_title AS job_title',
        'profile.company_name AS company_name',
      ])
      .where('app.id = :id', { id: application.id })
      .getRawOne();

    const jobTitle = result?.job_title || 'a job';
    const companyName = result?.company_name || 'the company';

    console.log(`📤 Sending withdrawal email to ${user.email}`);

    await this.mailService.sendApplicationWithdrawalEmail(
      `${user.first_name} ${user.last_name}`,
      user.email,
      jobTitle,
      companyName
    );
  } catch (err) {
    console.error('❌ Failed to send withdrawal email:', err);
  }

  return saved;
}


  async findByRecruiter(recruiterId: string): Promise<any[]> {
    const results = await this.applicationRepository
      .createQueryBuilder('app')
      .innerJoin('job_posts', 'job', 'job.id = app.job_id')
      .innerJoin('candidate_profiles', 'candidate', 'candidate.id = app.candidate_id')
      .innerJoin('users', 'user', 'user.id = candidate.user_id')
      .where('job.recruiter_id = :recruiterId', { recruiterId })
      .orderBy('app.applied_on', 'DESC')
      .select([
        'app.id AS application_id',
        'app.job_id AS job_id',
        'app.candidate_id AS candidate_id',
        'app.application_status_id AS status_id',
        'app.applied_on AS applied_on',
        'app.updated_on AS updated_on',
        'app.withdrawn AS withdrawn',
        'app.withdrawal_reason AS withdrawal_reason',
        'job.job_title AS job_title',
        'user.first_name AS candidate_name',
        'user.email AS candidate_email'
      ])
      .getRawMany();

    return results;
  }

  async updateStatus(id: string, status: string): Promise<Application> {
  const application = await this.applicationRepository.findOne({ where: { id } });
  if (!application) throw new NotFoundException('Application not found');

  application.application_status_id = status;
  const updatedApp = await this.applicationRepository.save(application);

  // ✅ Send shortlisted email if status is SHORTLISTED
  const SHORTLISTED_ID = 'e8d0da93-452c-11f0-8520-ac1f6bbcd360'; // replace with your actual UUID

  if (status === SHORTLISTED_ID) {
    try {
      // Get candidate profile to find user_id
      const candidate = await this.candidateProfilesRepository.findOne({
        where: { id: application.candidate_id },
      });

      if (!candidate) {
        throw new NotFoundException('Candidate profile not found');
      }

      const user = await this.usersRepository.findOne({
        where: { id: candidate.user_id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Fetch job title & company name
      const result = await this.applicationRepository
        .createQueryBuilder('app')
        .innerJoin('job_posts', 'job', 'job.id = app.job_id')
        .innerJoin('recruiter_profiles', 'profile', 'profile.user_id = job.recruiter_id')
        .select([
          'job.job_title AS job_title',
          'profile.company_name AS company_name',
        ])
        .where('app.id = :id', { id: application.id })
        .getRawOne();

      const jobTitle = result?.job_title || 'a job';
      const companyName = result?.company_name || 'the company';

      // 📧 Send email
      console.log(`📤 Sending shortlisted email to ${user.email}`);
      await this.mailService.sendShortlistedEmail(
        `${user.first_name} ${user.last_name}`,
        user.email,
        jobTitle,
        companyName
      );
      console.log(`📬 Shortlisted email sent to ${user.email}`);
    } catch (err) {
      console.error('❌ Failed to send shortlisted email:', err);
    }
  }

  return updatedApp;
}


  async getWithdrawnReason(id: string): Promise<{ reason: string | null }> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      select: ['withdrawn', 'withdrawal_reason'],
    });

    if (!application || !application.withdrawn) {
      throw new NotFoundException('Withdrawn application not found');
    }

    return { reason: application.withdrawal_reason || null };
  }

  async reactivate(id: string, userId: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['candidate_profile'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const candidate = await this.candidateProfilesRepository.findOne({
      where: { id: application.candidate_id },
    });

    if (!candidate || candidate.user_id !== userId) {
      throw new ForbiddenException('Unauthorized to reactivate this application');
    }

    application.withdrawn = false;
    application.withdrawal_reason = null;
    application.application_status_id = '12c7f28f-3a21-11f0-8520-ac1f6bbcd360';
    application.updated_by = userId;
    application.applied_on = new Date();

    return await this.applicationRepository.save(application);
  }

  // ✅ New Method: Get Applications Count by Job IDs
  async getCountByJobs(jobIds: string[]): Promise<Record<string, number>> {
    const counts = await this.applicationRepository
      .createQueryBuilder('app')
      .select('app.job_id', 'jobId')
      .addSelect('COUNT(app.id)', 'count')
      .where('app.job_id IN (:...jobIds)', { jobIds })
      .andWhere('app.withdrawn = :withdrawn', { withdrawn: false })
      .groupBy('app.job_id')
      .getRawMany();

    return counts.reduce((acc, curr) => {
      acc[curr.jobId] = parseInt(curr.count);
      return acc;
    }, {} as Record<string, number>);
  }
   async getCountsByStatus(recruiterId: string): Promise<{ shortlisted: number, rejected: number }> {
  const results = await this.applicationRepository
    .createQueryBuilder('app')
    .innerJoin('job_posts', 'job', 'job.id = app.job_id')
    .where('job.recruiter_id = :recruiterId', { recruiterId })
    .andWhere('app.withdrawn = :withdrawn', { withdrawn: false })
    .select([
      // Use actual UUIDs from your statusMap
      `SUM(CASE WHEN app.application_status_id = 'e8d0da93-452c-11f0-8520-ac1f6bbcd360' THEN 1 ELSE 0 END) AS shortlisted`,
      `SUM(CASE WHEN app.application_status_id = 'e8d0fb03-452c-11f0-8520-ac1f6bbcd360' THEN 1 ELSE 0 END) AS rejected`
    ])
    .getRawOne();

  return {
    shortlisted: parseInt(results.shortlisted) || 0,
    rejected: parseInt(results.rejected) || 0
  };
}

}



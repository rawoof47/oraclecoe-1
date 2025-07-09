import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from '../entities/job-post.entity';

@Injectable()
export class JobExpiryCron implements OnModuleInit {
  private readonly logger = new Logger(JobExpiryCron.name);

  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  // 🔁 Run daily at midnight
  @Cron('0 0 * * *')
  async handleJobExpiry() {
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const expiredStatusId = '8ee0cfea-566d-11f0-a900-ac1f6bbcd360';

    const result = await this.jobPostRepository
      .createQueryBuilder()
      .update(JobPost)
      .set({ status_id: expiredStatusId })
      .where('application_deadline < :today', { today })
      .andWhere('status_id != :expired', { expired: expiredStatusId })
      .execute();

    this.logger.log(`✔️ ${result.affected} job(s) marked as expired`);
  }

  // 🚀 Run once automatically on app startup (for dev testing)
  async onModuleInit() {
    this.logger.log('🔧 Dev Mode: Running job expiry check on startup...');
    await this.handleJobExpiry();
  }
}

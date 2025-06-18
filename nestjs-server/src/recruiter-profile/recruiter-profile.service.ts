import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecruiterProfile } from './entity/recruiter-profile.entity';
import { CreateRecruiterProfileDto } from './dto/create-recruiter-profile.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter-profile.dto';
import { Status } from 'src/statuses/entities/status.entity';

@Injectable()
export class RecruiterProfileService {
  constructor(
    @InjectRepository(RecruiterProfile)
    private readonly recruiterProfileRepository: Repository<RecruiterProfile>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  // ✅ Create or update recruiter profile
  async upsert(
    data: UpdateRecruiterProfileDto,
    userId: string,
  ): Promise<RecruiterProfile> {
    const DEFAULT_STATUS_ID = '34300a44-4775-11f0-8520-ac1f6bbcd360';

    let profile = await this.recruiterProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      // Create new profile
      profile = this.recruiterProfileRepository.create({
        ...data,
        user_id: userId,
        status_id: DEFAULT_STATUS_ID,
        created_by: userId,
        updated_by: userId,
      });
    } else {
      // Update existing profile
      Object.assign(profile, data, {
        updated_by: userId,
        updated_at: new Date(),
      });
    }

    return this.recruiterProfileRepository.save(profile);
  }

  // 🔍 Get recruiter profile by user ID
  async findByUserId(userId: string): Promise<RecruiterProfile | null> {
    return this.recruiterProfileRepository.findOne({
      where: { user_id: userId },
    });
  }
}

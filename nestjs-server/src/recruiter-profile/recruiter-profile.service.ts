import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RecruiterProfile } from './entity/recruiter-profile.entity';
import { CreateRecruiterProfileDto } from './dto/create-recruiter-profile.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter-profile.dto';
import { Status } from 'src/statuses/entities/status.entity';
import { RecruiterIndustry } from 'src/recruiter-industries/entities/recruiter-industry.entity';

@Injectable()
export class RecruiterProfileService {
  constructor(
    @InjectRepository(RecruiterProfile)
    private readonly recruiterProfileRepository: Repository<RecruiterProfile>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    private readonly entityManager: EntityManager,
  ) {}

  // ✅ Create or update recruiter profile (with industries)
  async upsert(
    data: UpdateRecruiterProfileDto,
    userId: string,
  ): Promise<RecruiterProfile> {
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const DEFAULT_STATUS_ID = '34300a44-4775-11f0-8520-ac1f6bbcd360';

      let profile = await transactionalEntityManager.findOne(RecruiterProfile, {
        where: { user_id: userId },
      });

      if (!profile) {
        // Create new profile
        profile = transactionalEntityManager.create(RecruiterProfile, {
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

      const savedProfile = await transactionalEntityManager.save(profile);

      // 🔄 Remove old industries
      await transactionalEntityManager.delete(RecruiterIndustry, {
        user_id: userId,
      });

      // ➕ Insert new selected industries
      const industries = (data.industryIds || []).map((industryId) =>
        transactionalEntityManager.create(RecruiterIndustry, {
          user_id: userId,
          industry_id: industryId,
        }),
      );
      await transactionalEntityManager.save(industries);

      return savedProfile;
    });
  }

  // 🔍 Get recruiter profile with industries by user ID
  async findByUserId(userId: string): Promise<RecruiterProfile | null> {
    const profile = await this.recruiterProfileRepository.findOne({
      where: { user_id: userId },
      relations: ['recruiterIndustries'], // Ensure entity is decorated with this relation
    });

    if (profile) {
      profile['industryIds'] = profile.recruiterIndustries.map(
        (ri) => ri.industry_id,
      );
    }

    return profile;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruiterLocation } from './recruiter-location.entity';
import { v4 as uuidv4 } from 'uuid';

interface UpsertRecruiterLocationInput {
  recruiter_profile_id: string;
  region_id: string;
  country_id?: string | null;
}

@Injectable()
export class RecruiterLocationService {
  constructor(
    @InjectRepository(RecruiterLocation)
    private readonly locationRepo: Repository<RecruiterLocation>,
  ) {}

  /**
   * Creates or updates a recruiter location based on profile ID.
   */
  async upsertLocation(data: UpsertRecruiterLocationInput): Promise<RecruiterLocation> {
    const existing = await this.locationRepo.findOneBy({
      recruiter_profile_id: data.recruiter_profile_id,
    });

    if (existing) {
      existing.region_id = data.region_id;
      existing.country_id = data.country_id ?? null;
      return this.locationRepo.save(existing);
    }

    const newLocation = this.locationRepo.create({
      id: uuidv4(),
      recruiter_profile_id: data.recruiter_profile_id,
      region_id: data.region_id,
      country_id: data.country_id ?? null,
    });

    return this.locationRepo.save(newLocation);
  }

  /**
   * Fetch recruiter location details by profile ID with region and country relations.
   */
  async getLocationByProfile(profileId: string): Promise<RecruiterLocation | null> {
    return this.locationRepo.findOne({
      where: { recruiter_profile_id: profileId },
      relations: ['region', 'country'],
    });
  }
}

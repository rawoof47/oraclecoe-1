import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruiterLocation } from './recruiter-location.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RecruiterLocationService {
  constructor(
    @InjectRepository(RecruiterLocation)
    private readonly locationRepo: Repository<RecruiterLocation>,
  ) {}

  async upsertLocation(data: {
    recruiter_profile_id: string;
    region_id: string;
    country_id?: string | null;
  }): Promise<RecruiterLocation> {
    const existing = await this.locationRepo.findOneBy({
      recruiter_profile_id: data.recruiter_profile_id,
    });

    if (existing) {
      // Update
      existing.region_id = data.region_id;
      existing.country_id = data.country_id ?? null;
      return this.locationRepo.save(existing);
    }

    // Insert
    const location = this.locationRepo.create({
      id: uuidv4(),
      recruiter_profile_id: data.recruiter_profile_id,
      region_id: data.region_id,
      country_id: data.country_id ?? null,
    });

    return this.locationRepo.save(location);
  }

  async getLocationByProfile(profileId: string): Promise<RecruiterLocation | null> {
    return this.locationRepo.findOne({
      where: { recruiter_profile_id: profileId },
      relations: ['region', 'country'],
    });
  }
}

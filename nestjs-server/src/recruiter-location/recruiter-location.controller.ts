import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RecruiterLocationService } from './recruiter-location.service';
import { RecruiterLocation } from './recruiter-location.entity';

@Controller('recruiter-locations')
export class RecruiterLocationController {
  constructor(private readonly locationService: RecruiterLocationService) {}

  @Post()
  async saveLocation(
    @Body()
    data: {
      recruiter_profile_id: string;
      region_id: string;
      country_id?: string | null;
    },
  ): Promise<RecruiterLocation> {
    return this.locationService.upsertLocation(data);
  }

  @Get(':profileId')
  async getLocation(@Param('profileId') profileId: string): Promise<RecruiterLocation | null> {
    return this.locationService.getLocationByProfile(profileId);
  }
}

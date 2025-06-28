import { IsUUID, IsOptional } from 'class-validator';

export class CreateRecruiterLocationDto {
  @IsUUID()
  recruiter_profile_id: string;

  @IsUUID()
  region_id: string;

  @IsOptional()
  @IsUUID()
  country_id?: string;
}

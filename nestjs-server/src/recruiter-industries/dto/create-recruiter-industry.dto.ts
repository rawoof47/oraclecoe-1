import { IsUUID } from 'class-validator';

export class CreateRecruiterIndustryDto {
  @IsUUID()
  profile_id: string; // ✅ Renamed from user_id

  @IsUUID()
  industry_id: string;
}

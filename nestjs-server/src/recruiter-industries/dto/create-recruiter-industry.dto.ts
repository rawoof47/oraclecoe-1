import { IsUUID } from 'class-validator';

export class CreateRecruiterIndustryDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  industry_id: string;
}
import { IsOptional, IsString, IsUUID, IsUrl, MaxLength } from 'class-validator';

export class CreateRecruiterProfileDto {
  @IsUUID()
  user_id: string;

  @IsString()
  @MaxLength(255)
  company_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  company_size?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @IsString()
  company_description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  recruiter_position?: string;

  @IsOptional()
  @IsUUID()
  status_id?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @IsUUID()
  updated_by?: string;
}
